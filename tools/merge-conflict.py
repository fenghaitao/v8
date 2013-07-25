#!/usr/bin/env python
#
# Copyright 2012 the V8 project authors. All rights reserved.
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#     * Redistributions of source code must retain the above copyright
#       notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above
#       copyright notice, this list of conditions and the following
#       disclaimer in the documentation and/or other materials provided
#       with the distribution.
#     * Neither the name of Google Inc. nor the names of its
#       contributors may be used to endorse or promote products derived
#       from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import sys
import os

# This script generates the x32 sources from annoated x64 codes.
# <Usage>:
#   ./generate-x32-source.py {debug|release} output_file_names input_file_names
#
# The annotations include:
#   __a (argument) : Replace (n + 1) * kPointerSize with 1 * kRegisterSize +
#                    n * kPointerSize and __a with __ or remove "__a ".
#   The size of return address is kRegisterSize for X32, the current X64 codes
#   assume return address size is kPointerSize, so we replace the argument
#   access offset with the right value.
#
#   __k (keep) : Keep the current line unchanged and replace __k with __
#                or remove "__k ".
#   We need to use 64-bit instructions for X32 when:
#     1) Load/Store 64-bit value.
#     2) Load/Store double into heap number field
#     3) Use push/pop for return address and FP register
#     4) Get signed index register for SIB access
#
#   __q (quad) : Replace kPointerSize with kRegisterSize and __q with __
#                or remove "__q ".
#   We need to use quadword for X32 when:
#     1) Pass arguments to the C++ runtime, we need 8-byte in the stack
#         according to X32 ABI (https://sites.google.com/site/x32abi/)
#     2) Access a stack slot when skipping return address or FP
#     3) Compute size of state in the deoptimization process as we store state
#        as quadword in the stack
#
#   __n : Replace RelocInfo::NONE64 with RelocInfo::NONE32.
#
#   __s (quad, keep) : Combine __k and __q. It is used when storing a register
#     to the runtime stack for RegExp.
#
# After handling the annotations, if not __k or __s, the rest of the line will
# be processed according to the operator_handlers (see below).

argument_replacements = {
  "1 * kPointerSize" : "1 * kRegisterSize",
  "2 * kPointerSize" : "1 * kRegisterSize + 1 * kPointerSize",
  "3 * kPointerSize" : "1 * kRegisterSize + 2 * kPointerSize",
  "4 * kPointerSize" : "1 * kRegisterSize + 3 * kPointerSize",
  "5 * kPointerSize" : "1 * kRegisterSize + 4 * kPointerSize",
  "6 * kPointerSize" : "1 * kRegisterSize + 5 * kPointerSize",
  "i * kPointerSize" : "1 * kRegisterSize + (i - 1) * kPointerSize",
  "argc * kPointerSize" : "1 * kRegisterSize + (argc - 1) * kPointerSize",
  "(argc - 0) * kPointerSize"  : "1 * kRegisterSize + (argc - 1) * kPointerSize",
  "(argc + 1) * kPointerSize"  : "1 * kRegisterSize + argc * kPointerSize",
  "(argc_ + 1) * kPointerSize" : "1 * kRegisterSize + argc_ * kPointerSize",
}

def HandleArgument(line):
  result = line
  if result.find("times_pointer_size, 0)") != -1:
    result = result.replace("times_pointer_size, 0)", \
                            "times_pointer_size, kPointerSize)")
  else:
    for argument in argument_replacements:
      if result.find(argument) != -1:
        result = result.replace(argument, argument_replacements[argument])
        break

  return (True, result)

def HandleKeep(line):
  return (False, line)

def HandleQuad(line):
  result = line
  result = result.replace("kPointerSize", "kRegisterSize")
  return (True, result)

def HandleNone64(line):
  result = line
  result = result.replace("RelocInfo::NONE64", "RelocInfo::NONE32")
  return (True, result)

def HandleQuadKeep(line):
  (cont, result) = HandleQuad(line)
  return HandleKeep(result)

annotation_handlers = {
  " __a" : [" ", HandleArgument],
  " __k" : [" ", HandleKeep],
  " __q" : [" ", HandleQuad],
  " __n" : [" ", HandleNone64],
  " __s" : [" ", HandleQuadKeep],
}

def Replace(line, key):
  return line.replace(key, operator_handlers[key][0])

def HandlePushPop(line, key):
  if line.find("push(rbp)") == -1 and line.find("pop(rbp)") == -1 and \
     line.find("PopReturnAddressTo") == -1 and \
     line.find("PushReturnAddressFrom") == -1:
    return Replace(line, key)
  else:
    return line

def HandleMovQ(line, key):
  result = line
  if result.find("xmm") == -1 and result.find("double_scratch") == -1 and \
     result.find("V8_UINT64_C") == -1 and result.find("V8_INT64_C") == -1:
    result = Replace(result, key)
    if result.find("kZapValue") != -1 and result.find("NONE64") != -1:
      result = result.replace("int64_t", "int32_t")
      result = result.replace("NONE64", "NONE32")
  return result

operator_handlers = {
  "movq("       : ("movl(",     HandleMovQ),
  "push("       : ("Push(",  HandlePushPop),
  "pop("        : ("Pop(",   HandlePushPop),
  "push_imm32(" : ("Push_imm32(",  Replace),
  " cmovq("     : (" cmovl(",      Replace),
  " xchg("      : (" xchgl(",      Replace),
  " addq("      : (" addl(",       Replace),
  " sbbq("      : (" sbbl(",       Replace),
  " cmpq("      : (" cmpl(",       Replace),
  " and_("      : (" andl(",       Replace),
  " decq("      : (" decl(",       Replace),
  " cqo("       : (" cdq(",        Replace),
  " idivq("     : (" idivl(",      Replace),
  " imul("      : (" imull(",      Replace),
  " incq("      : (" incl(",       Replace),
  " lea("       : (" leal(",       Replace),
  " neg("       : (" negl(",       Replace),
  " not_("      : (" notl(",       Replace),
  " or_("       : (" orl(",        Replace),
  " rol("       : (" roll(",       Replace),
  " ror("       : (" rorl(",       Replace),
  " sar("       : (" sarl(",       Replace),
  " sar_cl("    : (" sarl_cl(",    Replace),
  " shl("       : (" shll(",       Replace),
  " shl_cl("    : (" shll_cl(",    Replace),
  " shr("       : (" shrl(",       Replace),
  " shr_cl("    : (" shrl_cl(",    Replace),
  " subq("      : (" subl(",       Replace),
  " testq("     : (" testl(",      Replace),
  " xor_("      : (" xorl(",       Replace),
  " movzxbq("   : (" movzxbl(",    Replace),
  " repmovsq("  : (" repmovsl(",   Replace),
}

def HandleAnnotations(line, debug):
  cont   = True
  result = line
  for annotation in annotation_handlers:
    if result.find(annotation) != -1:
      if result.find(annotation + " ") != -1:
        if result.find("#define" + annotation + " __") != -1:
          # Add a new line to keep debugging easier if debug
          result = "\n" if debug else ""
          annotation_handlers[annotation][0] = " __"
        else:
          (cont, result) = annotation_handlers[annotation][1](result)
          if annotation_handlers[annotation][0] == " ":
            result = result.replace(annotation + " ", \
                                    annotation_handlers[annotation][0])
          else:
            result = result.replace(annotation, \
                                    annotation_handlers[annotation][0])
      else:
        if result.find("#define") != -1 or result.find("#undef") != -1:
          # Add a new line to keep debugging easier if debug
          result = "\n" if debug else ""
          annotation_handlers[annotation][0] = " "
      break

  return (cont, result)

comment_replacements = {
  "rbp[24]"   : "rbp[20]",
  "rbp[32]"   : "rbp[24]",
  "rbp[-n-8]" : "rbp[-n-4]",
  "rsp[16]"   : "rsp[12]",
  "rsp[24]"   : "rsp[16]",
  "rsp[32]"   : "rsp[20]",
  "rsp[40]"   : "rsp[24]",
  "rsp[48]"   : "rsp[28]",
  "rsp[56]"   : "rsp[32]",
  "rsp[argc * 8]"                  : "rsp[(argc - 1) * 4 + 8]",
  "rsp[kFastApiCallArguments * 8]" : "rsp[(kFastApiCallArguments - 1) * 4 + 8]",
  "rsp[8 * argc]"                  : "rsp[(argc - 1) * 4 + 8]",
  "rsp[8 * n]"                     : "rsp[(n - 1) * 4 + 8]",
  "rsp[8 * num_arguments]"         : "rsp[(num_arguments - 1) * 4 + 8]",
  "rsp[8 * (argc + 1)]"            : "rsp[argc * 4 + 8]",
  "rsp[kFastApiCallArguments * 8 + 8]" : "rsp[kFastApiCallArguments * 4 + 8]",
  "rsp[8 * (n + 1)]"               : "rsp[n * 4 + 8]",
  "rsp[(argc + 1) * 8]"            : "rsp[argc * 4 + 8]",
  "rsp[(argc + 6) * 8]"            : "rsp[(argc + 5) * 4 + 8]",
  "rsp[(argc + 7) * 8]"            : "rsp[(argc + 6) * 4 + 8]",
  "rsp[(argc - n) * 8]"            : "rsp[(argc - n - 1) * 4 + 8]",
}

def HandleComment(line):
  result = line
  for comment in comment_replacements:
    if result.find(comment) != -1:
      result = result.replace(comment, comment_replacements[comment])
      break

  return result

def ProcessLine(line, is_assembler, debug):
  if line.find("#include") != -1:
    result = line.replace("x64", "x32")
  else:
    result = line.replace("X64", "X32")
    if not is_assembler:
      (cont, result) = HandleAnnotations(result, debug)
      if cont:
        for key in operator_handlers:
          if result.find(key) != -1:
            handler = operator_handlers[key][1]
            result  = handler(result, key)
            break

  return result


def ProcessLines(lines_in, lines_out, line_number):
  line_in  = lines_in[line_number]
  if line_in.find("<<<<<<< HEAD") == 0:
    begin = line_number

    line_number += 1;
    line_in = lines_in[line_number]
    while (line_in.find("=======")) != 0:
      lines_out.append(line_in)
      line_number += 1;
      line_in = lines_in[line_number]
    line_number += 1;
    line_in = lines_in[line_number]
    while (line_in.find(">>>>>>>")) != 0:
      line_number += 1;
      line_in = lines_in[line_number]

    return line_number - begin + 1
  else:
    lines_out.append(line_in)
    return 1

def ProcessFile(name):
  f_in = open(name, "r")
  lines_in = f_in.readlines()
  f_in.close()

# Process lines of the input file
  is_assembler = name.find("assembler-x64") == 14
  lines_out = []
  line_number = 0
  total_lines = len(lines_in)
  while line_number < total_lines:
    line_number += ProcessLines(lines_in, lines_out, line_number)

# Write generated contents into output file
  f_out = open(name, "w")
  for item in lines_out:
    f_out.write(item)
  f_out.close()

  return 0

def Main():
  argc = len(sys.argv)
  if (argc == 1):
    print("Usage: %s input_file_names" % sys.argv[0])
    return 1

  ProcessFile(sys.argv[1])

if __name__ == '__main__':
  sys.exit(Main())
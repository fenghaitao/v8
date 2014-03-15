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

def HandleKeep(line):
  return (False, line)

annotation_handlers = {
  " __k" : [" ", HandleKeep],
}

def Replace(line, key, lines, line_number):
  return line.replace(key, operator_handlers[key][0])

def HandlePushPop(line, key, lines, line_number):
  if line.find("push(rbp)") == -1 and line.find("pop(rbp)") == -1 and \
     line.find("PopReturnAddressTo") == -1 and \
     line.find("PushReturnAddressFrom") == -1:
    return Replace(line, key, lines, line_number)
  else:
    if line.find("push(") != -1:
      return line.replace("push(", "pushq(")
    elif line.find("pop(") != -1:
      return line.replace("pop(", "popq(")
    return line

def HandleMovQ(line, key, lines, line_number):
  result = line
  keep = False
  while True:
    operands = lines[line_number]
    if operands.find("xmm") != -1 or \
       operands.find("V8_UINT64_C") != -1 or operands.find("V8_INT64_C") != -1 or \
       operands.find("double_scratch") != -1 or \
       operands.find("HeapNumber::kValueOffset") != -1 or \
       operands.find("FixedDoubleArray::kHeaderSize") != -1 or \
       operands.find("kNaNValue") != -1 or \
       operands.find("kHoleNanInt64") != -1 or \
       operands.find("kRegisterSize") != -1 or \
       operands.find("StackOperandForReturnAddress") != -1:
      keep = True
    if operands.find(");") != -1:
      break
    line_number += 1
  if not keep:
    result = Replace(result, key, lines, line_number)

  return result

operator_handlers = {
  "movq("       : ("movp(",     HandleMovQ),
  "push("       : ("pushp(", HandlePushPop),
  "pop("        : ("popp(",  HandlePushPop),
  "push_imm32(" : ("pushp_imm32(", Replace),
}

def HandleAnnotations(line, debug):
  cont   = True
  result = line
  for annotation in annotation_handlers:
    if result.find(annotation) != -1:
      if result.find(annotation + " ") != -1:
        if result.find("#define" + annotation + " __") != -1:
          # Add a new line to keep debugging easier if debug
          annotation_handlers[annotation][0] = annotation
        else:
          (cont, result) = annotation_handlers[annotation][1](result)
          if annotation_handlers[annotation][0] == " ":
            pass
          else:
            result = result.replace(annotation, \
                                    annotation_handlers[annotation][0])
      else:
        if result.find("#define") != -1 or result.find("#undef") != -1:
          # Add a new line to keep debugging easier if debug
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

def ProcessLine(lines, line_number, is_assembler, debug):
  result = lines[line_number]
  if not is_assembler:
    (cont, result) = HandleAnnotations(result, debug)
    if cont:
      for key in operator_handlers:
        if result.find(key) != -1:
          handler = operator_handlers[key][1]
          result  = handler(result, key, lines, line_number)
          break

  return result


def ProcessLines(lines_in, lines_out, line_number, is_assembler, debug):
  line_in  = lines_in[line_number]

  if line_in.find("#ifdef V8_TARGET_ARCH_X32") != -1:
    # Process codes inside #ifdef V8_TARGET_ARCH_X32 lines #endif
    # If debug, keep the #ifdef and #endif, otherwise remove them
    begin = line_number
    lines_out.append(line_in)

    line_number += 1;
    line_in = lines_in[line_number]
    while (line_in.find("#endif")) == -1:
      lines_out.append(line_in)
      line_number += 1;
      line_in = lines_in[line_number]

    lines_out.append(line_in)

    return line_number - begin + 1
  elif line_in.find("#ifndef V8_TARGET_ARCH_X32") != -1:
    # Process codes inside #ifndef V8_TARGET_ARCH_X32 x64_lines #endif or
    # #ifndef V8_TARGET_ARCH_X32 x64_lines #else x32_lines #endif
    # If debug, keep all, otherwise remove #ifdef, x64_lines, #else and #endif
    begin = line_number
    lines_out.append(line_in)

    depth = 1;
    line_number += 1;
    line_in = lines_in[line_number]
    while (line_in.find("#else") == -1 and line_in.find("#endif") == -1) or depth > 1:
      lines_out.append(line_in)
      line_number += 1;
      line_in = lines_in[line_number]
      if (line_in.find("#if") != -1 or line_in.find("#ifdef") != -1):
        depth += 1
      elif line_in.find("#endif") != -1 and depth > 1:
        depth -= 1
        lines_out.append(line_in)
        line_number += 1;
        line_in = lines_in[line_number]

    if (line_in.find("#else")) != -1:
      lines_out.append(line_in)
      line_number += 1;
      line_in = lines_in[line_number]
      while (line_in.find("#endif")) == -1:
        lines_out.append(line_in)
        line_number += 1;
        line_in = lines_in[line_number]
    lines_out.append(line_in)

    return line_number - begin + 1
  else:
    line_out = ProcessLine(lines_in, line_number, is_assembler, debug)
    lines_out.append(line_out)
    return 1

def ProcessFile(name, debug):
  f_in = open(name, "r")
  lines_in = f_in.readlines()
  f_in.close()

# Replace x64 with x32 to form the name "../../src/x32/code-stubs-x32.[h|cc]"
# Create x32 folder if it does not exist
  out_filename = name
  if not os.path.exists(os.path.dirname(out_filename)):
    os.makedirs(os.path.dirname(out_filename))

# Process lines of the input file
  is_assembler = name.find("assembler-x64") == 10
  lines_out = []
  line_number = 0
  total_lines = len(lines_in)
  while line_number < total_lines:
    line_number += ProcessLines(lines_in, lines_out, line_number, \
                                is_assembler, debug)

# Write generated contents into output file
  f_out = open(out_filename, "w")
  for item in lines_out:
    f_out.write(item)
  f_out.close()

  return 0

def Main():
  argc = len(sys.argv)
  if (argc == 1):
    print("Usage: %s {debug|release} output_file_names input_file_names" % \
           sys.argv[0])
    return 1

  mode = sys.argv[1].lower()
  if mode != "debug" and mode != 'release':
    print("{debug|release} mode is expected")
    return 1
  debug = True if mode == "debug" else False

  if (argc == 2):
    print("%s: No output file names and input file names" % sys.argv[0])
    return 1

  if (argc % 2 == 1):
    print("%s: The number of output files should be equal with input files" % \
           sys.argv[0])
    return 1

  input_start = argc/2 + 1
  x64_source_lists = sys.argv[input_start:]

  for item in x64_source_lists:
    ProcessFile(item, debug)

if __name__ == '__main__':
  sys.exit(Main())

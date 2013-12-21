// Copyright 2013 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"use strict";

// This file relies on the fact that the following declaration has been made
// in runtime.js:
// var $Array = global.Array;

var $SIMD = global.SIMD;

var $Float32x4 = $SIMD.float32x4;

function ThrowFloat32x4TypeError() {
  throw MakeTypeError("this is not a float32x4 value.");
}

function Float32x4Constructor(x, y, z, w) {
  if (!IS_NUMBER(x)) x = NonNumberToNumber(x);
  if (!IS_NUMBER(y)) y = NonNumberToNumber(y);
  if (!IS_NUMBER(z)) x = NonNumberToNumber(z);
  if (!IS_NUMBER(w)) y = NonNumberToNumber(w);

  var value = %CreateFloat32x4(x, y, z, w);
  if (%_IsConstructCall()) {
    %_SetValueOf(this, value);
  } else {
    return value;
  }
}

function Float32x4ZeroConstructor() {
  if (%_IsConstructCall()) {
    return new $Float32x4(0.0, 0.0, 0.0, 0.0);
  } else {
    return %CreateFloat32x4(0.0, 0.0, 0.0, 0.0);
  }
}

function Float32x4SplatConstructor(s) {
  if (!IS_NUMBER(s)) s = NonNumberToNumber(s);
  if (%_IsConstructCall()) {
    return new $Float32x4(s, s, s, s);
  } else {
    return %CreateFloat32x4(s, s, s, s);
  }
}

function Float32x4GetX() {
  var float32x4 = IS_FLOAT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_FLOAT32x4(float32x4);
  return %Float32x4GetX(float32x4);
}

function Float32x4GetY() {
  var float32x4 = IS_FLOAT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_FLOAT32x4(float32x4);
  return %Float32x4GetY(float32x4);
}

function Float32x4GetZ() {
  var float32x4 = IS_FLOAT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_FLOAT32x4(float32x4);
  return %Float32x4GetZ(float32x4);
}

function Float32x4GetW() {
  var float32x4 = IS_FLOAT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_FLOAT32x4(float32x4);
  return %Float32x4GetW(float32x4);
}

function Float32x4GetSignMask() {
  var float32x4 = IS_FLOAT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_FLOAT32x4(float32x4);
  return %Float32x4GetSignMask(float32x4);
}

function Float32x4ToString() {
  if (IS_FLOAT32x4_WRAPPER(this)) {
    return ObjectToString.apply(this);
  } else if (IS_FLOAT32x4(this)) {
    return "float32x4(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")";
  } else {
    throw MakeTypeError('float32x4_to_string');
  }
}

function Float32x4ValueOf() {
  if (!IS_FLOAT32x4(this) && !IS_FLOAT32x4_WRAPPER(this)) {
    ThrowFloat32x4TypeError();
  }
  return %_ValueOf(this);
}

function SetUpFloat32x4() {
  %CheckIsBootstrapping();

  %SetCode($Float32x4, Float32x4Constructor);
  %SetCode($Float32x4.zero, Float32x4ZeroConstructor);
  %SetCode($Float32x4.splat, Float32x4SplatConstructor);

  %FunctionSetPrototype($Float32x4, new $Float32x4(0.0, 0.0, 0.0, 0.0));
  %FunctionSetPrototype($Float32x4.zero, $Float32x4.prototype);
  %FunctionSetPrototype($Float32x4.splat, $Float32x4.prototype);
  %SetProperty($Float32x4.prototype, "constructor", $Float32x4, DONT_ENUM);

  InstallGetter($Float32x4.prototype, "x", Float32x4GetX);
  InstallGetter($Float32x4.prototype, "y", Float32x4GetY);
  InstallGetter($Float32x4.prototype, "z", Float32x4GetZ);
  InstallGetter($Float32x4.prototype, "w", Float32x4GetW);
  InstallGetter($Float32x4.prototype, "signMask", Float32x4GetSignMask);
  InstallFunctions($Float32x4.prototype, DONT_ENUM, $Array(
    "toString", Float32x4ToString,
    "valueOf", Float32x4ValueOf
  ));
}

SetUpFloat32x4();

//------------------------------------------------------------------------------

var $Int32x4 = $SIMD.int32x4;

function ThrowInt32x4TypeError() {
  throw MakeTypeError("this is not a int32x4 value.");
}

function Int32x4Constructor(x, y, z, w) {
  x = TO_INT32(x);
  y = TO_INT32(y);
  z = TO_INT32(z);
  w = TO_INT32(w);

  var value = %CreateInt32x4(x, y, z, w);
  if (%_IsConstructCall()) {
    %_SetValueOf(this, value);
  } else {
    return value;
  }
}

function Int32x4ZeroConstructor() {
  if (%_IsConstructCall()) {
    return new $Int32x4(0, 0, 0, 0);
  } else {
    return %CreateInt32x4(0, 0, 0, 0);
  }
}

function Int32x4BoolConstructor(x, y, z, w) {
  x = x ? -1 : 0;
  y = y ? -1 : 0;
  z = z ? -1 : 0;
  w = w ? -1 : 0;

  if (%_IsConstructCall()) {
    return new $Int32x4(x, y, z, w);
  } else {
    return %CreateInt32x4(x, y, z, w);
  }
}

function Int32x4SplatConstructor(s) {
  if (!IS_NUMBER(s)) s = NonNumberToNumber(s);

  if (%_IsConstructCall()) {
    return new $Int32x4(s, s, s,s);
  } else {
    return %CreateInt32x4(s, s, s, s);
  }
}

function Int32x4GetX() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetX(int32x4);
}

function Int32x4GetY() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetY(int32x4);
}

function Int32x4GetZ() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetZ(int32x4);
}

function Int32x4GetW() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetW(int32x4);
}

function Int32x4GetFlagX() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetFlagX(int32x4);
}

function Int32x4GetFlagY() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetFlagY(int32x4);
}

function Int32x4GetFlagZ() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetFlagZ(int32x4);
}

function Int32x4GetFlagW() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetFlagW(int32x4);
}

function Int32x4GetSignMask() {
  var int32x4 = IS_INT32x4_WRAPPER(this) ? %_ValueOf(this) : this;
  CHECK_INT32x4(int32x4);
  return %Int32x4GetSignMask(int32x4);
}

function Int32x4ToString() {
  if (IS_INT32x4_WRAPPER(this)) {
    return ObjectToString.apply(this);
  } else if (IS_INT32x4(this)) {
    return "int32x4(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")";
  } else {
    throw MakeTypeError('int32x4_to_string');
  }
}

function Int32x4ValueOf() {
  if (!IS_INT32x4(this) && !IS_INT32x4_WRAPPER(this)) {
    ThrowInt32x4TypeError();
  }
  return %_ValueOf(this);
}

function SetUpInt32x4() {
  %CheckIsBootstrapping();

  %SetCode($Int32x4, Int32x4Constructor);
  %SetCode($Int32x4.zero, Int32x4ZeroConstructor);
  %SetCode($Int32x4.bool, Int32x4BoolConstructor);
  %SetCode($Int32x4.splat, Int32x4SplatConstructor);

  %FunctionSetPrototype($Int32x4, new $Int32x4(0, 0, 0, 0));
  %FunctionSetPrototype($Int32x4.zero, $Int32x4.prototype);
  %FunctionSetPrototype($Int32x4.bool, $Int32x4.prototype);
  %FunctionSetPrototype($Int32x4.splat, $Int32x4.prototype);
  %SetProperty($Int32x4.prototype, "constructor", $Int32x4, DONT_ENUM);

  InstallGetter($Int32x4.prototype, "x", Int32x4GetX);
  InstallGetter($Int32x4.prototype, "y", Int32x4GetY);
  InstallGetter($Int32x4.prototype, "z", Int32x4GetZ);
  InstallGetter($Int32x4.prototype, "w", Int32x4GetW);
  InstallGetter($Int32x4.prototype, "flagX", Int32x4GetFlagX);
  InstallGetter($Int32x4.prototype, "flagY", Int32x4GetFlagY);
  InstallGetter($Int32x4.prototype, "flagZ", Int32x4GetFlagZ);
  InstallGetter($Int32x4.prototype, "flagW", Int32x4GetFlagW);
  InstallGetter($Int32x4.prototype, "signMask", Int32x4GetSignMask);
  InstallFunctions($Int32x4.prototype, DONT_ENUM, $Array(
    "toString", Int32x4ToString,
    "valueOf", Int32x4ValueOf
  ));
}

SetUpInt32x4();

//------------------------------------------------------------------------------

function SIMDAbs(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDAbs(t);
}

function SIMDNeg(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDNeg(t);
}

function SIMDAdd(a, b) {
  a = TO_FLOAT32x4(a);
  CHECK_FLOAT32x4(a);
  b = TO_FLOAT32x4(b);
  CHECK_FLOAT32x4(b);
  return %SIMDAdd(a, b);
}

function SIMDSub(a, b) {
  a = TO_FLOAT32x4(a);
  CHECK_FLOAT32x4(a);
  b = TO_FLOAT32x4(b);
  CHECK_FLOAT32x4(b);
  return %SIMDSub(a, b);
}

function SIMDMul(a, b) {
  a = TO_FLOAT32x4(a);
  CHECK_FLOAT32x4(a);
  b = TO_FLOAT32x4(b);
  CHECK_FLOAT32x4(b);
  return %SIMDMul(a, b);
}

function SIMDDiv(a, b) {
  a = TO_FLOAT32x4(a);
  CHECK_FLOAT32x4(a);
  b = TO_FLOAT32x4(b);
  CHECK_FLOAT32x4(b);
  return %SIMDDiv(a, b);
}

function SIMDClamp(t, lowerLimit, upperLimit) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  lowerLimit = TO_FLOAT32x4(lowerLimit);
  CHECK_FLOAT32x4(lowerLimit);
  upperLimit = TO_FLOAT32x4(upperLimit);
  CHECK_FLOAT32x4(upperLimit);
  return %SIMDClamp(t, lowerLimit, upperLimit);
}

function SIMDMin(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDMin(t, other);
}

function SIMDMax(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDMax(t, other);
}

function SIMDReciprocal(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDReciprocal(t);
}

function SIMDReciprocalSqrt(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDReciprocalSqrt(t);
}

function SIMDScale(t, s) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  if (!IS_NUMBER(s)) s = NonNumberToNumber(s);
  return %SIMDScale(t, s);
}

function SIMDSqrt(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDSqrt(t);
}

function SIMDShuffle(t, mask) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  var value = TO_INT32(mask);
  if ((value < 0) || (value > 0xFF)) {
    throw MakeRangeError("invalid_simd_shuffle_mask");
  }
  return %SIMDShuffle(t, mask);
}

function SIMDShuffleu32(t, mask) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  var value = TO_INT32(mask);
  if ((value < 0) || (value > 0xFF)) {
    throw MakeRangeError("invalid_simd_shuffleu32_mask");
  }
  return %SIMDShuffleu32(t, mask);
}

function SIMDShuffleMix(a, b, mask) {
  a = TO_FLOAT32x4(a);
  b = TO_FLOAT32x4(b);
  CHECK_FLOAT32x4(a);
  CHECK_FLOAT32x4(b);
  var value = TO_INT32(mask);
  if ((value < 0) || (value > 0xFF)) {
    throw MakeRangeError("invalid_simd_shuffleMix_mask");
  }
  return %SIMDShuffleMix(a, b, mask);
}

function SIMDWithX(t, x) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  if (!IS_NUMBER(x)) x = NonNumberToNumber(x);
  return %SIMDWithX(t, x);
}

function SIMDWithY(t, y) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  if (!IS_NUMBER(y)) y = NonNumberToNumber(y);
  return %SIMDWithY(t, y);
}

function SIMDWithZ(t, z) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  if (!IS_NUMBER(z)) z = NonNumberToNumber(z);
  return %SIMDWithZ(t, z);
}

function SIMDWithW(t, w) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  if (!IS_NUMBER(w)) w = NonNumberToNumber(w);
  return %SIMDWithW(t, w);
}

function SIMDToFloat32x4(t) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  return %SIMDToFloat32x4(t);
}

function SIMDBitsToFloat32x4(t) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  return %SIMDBitsToFloat32x4(t);
}

function SIMDToInt32x4(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDToInt32x4(t);
}

function SIMDBitsToInt32x4(t) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  return %SIMDBitsToInt32x4(t);
}

function SIMDLessThan(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDLessThan(t, other);
}

function SIMDLessThanOrEqual(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDLessThanOrEqual(t, other);
}

function SIMDEqual(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDEqual(t, other);
}

function SIMDNotEqual(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDNotEqual(t, other);
}

function SIMDGreaterThanOrEqual(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDGreaterThanOrEqual(t, other);
}

function SIMDGreaterThan(t, other) {
  t = TO_FLOAT32x4(t);
  CHECK_FLOAT32x4(t);
  other = TO_FLOAT32x4(other);
  CHECK_FLOAT32x4(other);
  return %SIMDGreaterThan(t, other);
}

function SIMDAnd(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDAnd(a, b);
}

function SIMDOr(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDOr(a, b);
}

function SIMDXor(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDXor(a, b);
}

function SIMDNot(t) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  return %SIMDNot(t);
}

function SIMDAndf32(a, b) {
  a = SIMDBitsToInt32x4(a);
  b = SIMDBitsToInt32x4(b);
  return SIMDBitsToFloat32x4(SIMDAnd(a, b));
}

function SIMDOrf32(a, b) {
  a = SIMDBitsToInt32x4(a);
  b = SIMDBitsToInt32x4(b);
  return SIMDBitsToFloat32x4(SIMDOr(a, b));
}

function SIMDXorf32(a, b) {
  a = SIMDBitsToInt32x4(a);
  b = SIMDBitsToInt32x4(b);
  return SIMDBitsToFloat32x4(SIMDXor(a, b));
}

function SIMDNotf32(t) {
  t = SIMDBitsToInt32x4(t);
  return SIMDBitsToFloat32x4(SIMDNot(t));
}

function SIMDNegu32(t) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  return %SIMDNegu32(t);
}

function SIMDAddu32(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDAddu32(a, b);
}

function SIMDSubu32(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDSubu32(a, b);
}

function SIMDMulu32(a, b) {
  a = TO_INT32x4(a);
  CHECK_INT32x4(a);
  b = TO_INT32x4(b);
  CHECK_INT32x4(b);
  return %SIMDMulu32(a, b);
}

function SIMDSelect(t, trueValue, falseValue) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  trueValue = TO_FLOAT32x4(trueValue);
  CHECK_FLOAT32x4(trueValue);
  falseValue = TO_FLOAT32x4(falseValue);
  CHECK_FLOAT32x4(falseValue);
  return %SIMDSelect(t, trueValue, falseValue);
}

function SIMDWithXu32(t, x) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  x = TO_UINT32(x);
  return %SIMDWithXu32(t, x);
}

function SIMDWithYu32(t, y) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  y = TO_UINT32(y);
  return %SIMDWithYu32(t, y);
}

function SIMDWithZu32(t, z) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  z = TO_UINT32(z);
  return %SIMDWithZu32(t, z);
}

function SIMDWithWu32(t, w) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  w = TO_UINT32(w);
  return %SIMDWithWu32(t, w);
}

function SIMDWithFlagX(t, x) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  x = ToBoolean(x);
  return %SIMDWithFlagX(t, x);
}

function SIMDWithFlagY(t, y) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  y = ToBoolean(y);
  return %SIMDWithFlagY(t, y);
}

function SIMDWithFlagZ(t, z) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  z = ToBoolean(z);
  return %SIMDWithFlagZ(t, z);
}

function SIMDWithFlagW(t, w) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  w = ToBoolean(w);
  return %SIMDWithFlagW(t, w);
}

function SIMDLessThanu32(t, other) {
  return SIMDGreaterThanu32(other, t);
}

function SIMDEqualu32(t, other) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  other = TO_INT32x4(other);
  CHECK_INT32x4(other);
  return %SIMDEqualu32(t, other);
}

function SIMDGreaterThanu32(t, other) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  other = TO_INT32x4(other);
  CHECK_INT32x4(other);
  return %SIMDGreaterThanu32(t, other);
}

function SIMDShiftLeftu32(t, s) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  s = TO_NUMBER_INLINE(s);
  var x = t.x << s;
  var y = t.y << s;
  var z = t.z << s;
  var w = t.w << s;
  return %CreateInt32x4(x, y, z, w);
}

function SIMDShiftRightu32(t, s) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  s = TO_NUMBER_INLINE(s);
  var x = t.x >>> s;
  var y = t.y >>> s;
  var z = t.z >>> s;
  var w = t.w >>> s;
  return %CreateInt32x4(x, y, z, w);
}

function SIMDShiftRightArithmeticu32(t, s) {
  t = TO_INT32x4(t);
  CHECK_INT32x4(t);
  s = TO_NUMBER_INLINE(s);
  var x = t.x >> s;
  var y = t.y >> s;
  var z = t.z >> s;
  var w = t.w >> s;
  return %CreateInt32x4(x, y, z, w);
}

function SetUpSIMD() {
  %CheckIsBootstrapping();

  %OptimizeObjectForAddingMultipleProperties($SIMD, 258);
  %SetProperty($SIMD, "XXXX", 0x00, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXXY", 0x40, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXXZ", 0x80, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXXW", 0xC0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXYX", 0x10, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXYY", 0x50, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXYZ", 0x90, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXYW", 0xD0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXZX", 0x20, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXZY", 0x60, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXZZ", 0xA0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXZW", 0xE0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXWX", 0x30, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXWY", 0x70, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXWZ", 0xB0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XXWW", 0xF0, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYXX", 0x04, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYXY", 0x44, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYXZ", 0x84, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYXW", 0xC4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYYX", 0x14, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYYY", 0x54, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYYZ", 0x94, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYYW", 0xD4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYZX", 0x24, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYZY", 0x64, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYZZ", 0xA4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYZW", 0xE4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYWX", 0x34, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYWY", 0x74, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYWZ", 0xB4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XYWW", 0xF4, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZXX", 0x08, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZXY", 0x48, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZXZ", 0x88, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZXW", 0xC8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZYX", 0x18, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZYY", 0x58, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZYZ", 0x98, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZYW", 0xD8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZZX", 0x28, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZZY", 0x68, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZZZ", 0xA8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZZW", 0xE8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZWX", 0x38, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZWY", 0x78, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZWZ", 0xB8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XZWW", 0xF8, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWXX", 0x0C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWXY", 0x4C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWXZ", 0x8C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWXW", 0xCC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWYX", 0x1C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWYY", 0x5C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWYZ", 0x9C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWYW", 0xDC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWZX", 0x2C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWZY", 0x6C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWZZ", 0xAC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWZW", 0xEC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWWX", 0x3C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWWY", 0x7C, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWWZ", 0xBC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "XWWW", 0xFC, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXXX", 0x01, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXXY", 0x41, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXXZ", 0x81, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXXW", 0xC1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXYX", 0x11, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXYY", 0x51, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXYZ", 0x91, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXYW", 0xD1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXZX", 0x21, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXZY", 0x61, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXZZ", 0xA1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXZW", 0xE1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXWX", 0x31, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXWY", 0x71, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXWZ", 0xB1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YXWW", 0xF1, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYXX", 0x05, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYXY", 0x45, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYXZ", 0x85, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYXW", 0xC5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYYX", 0x15, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYYY", 0x55, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYYZ", 0x95, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYYW", 0xD5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYZX", 0x25, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYZY", 0x65, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYZZ", 0xA5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYZW", 0xE5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYWX", 0x35, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYWY", 0x75, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYWZ", 0xB5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YYWW", 0xF5, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZXX", 0x09, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZXY", 0x49, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZXZ", 0x89, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZXW", 0xC9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZYX", 0x19, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZYY", 0x59, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZYZ", 0x99, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZYW", 0xD9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZZX", 0x29, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZZY", 0x69, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZZZ", 0xA9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZZW", 0xE9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZWX", 0x39, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZWY", 0x79, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZWZ", 0xB9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YZWW", 0xF9, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWXX", 0x0D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWXY", 0x4D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWXZ", 0x8D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWXW", 0xCD, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWYX", 0x1D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWYY", 0x5D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWYZ", 0x9D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWYW", 0xDD, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWZX", 0x2D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWZY", 0x6D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWZZ", 0xAD, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWZW", 0xED, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWWX", 0x3D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWWY", 0x7D, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWWZ", 0xBD, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "YWWW", 0xFD, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXXX", 0x02, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXXY", 0x42, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXXZ", 0x82, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXXW", 0xC2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXYX", 0x12, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXYY", 0x52, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXYZ", 0x92, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXYW", 0xD2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXZX", 0x22, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXZY", 0x62, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXZZ", 0xA2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXZW", 0xE2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXWX", 0x32, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXWY", 0x72, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXWZ", 0xB2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZXWW", 0xF2, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYXX", 0x06, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYXY", 0x46, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYXZ", 0x86, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYXW", 0xC6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYYX", 0x16, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYYY", 0x56, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYYZ", 0x96, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYYW", 0xD6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYZX", 0x26, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYZY", 0x66, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYZZ", 0xA6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYZW", 0xE6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYWX", 0x36, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYWY", 0x76, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYWZ", 0xB6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZYWW", 0xF6, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZXX", 0x0A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZXY", 0x4A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZXZ", 0x8A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZXW", 0xCA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZYX", 0x1A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZYY", 0x5A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZYZ", 0x9A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZYW", 0xDA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZZX", 0x2A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZZY", 0x6A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZZZ", 0xAA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZZW", 0xEA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZWX", 0x3A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZWY", 0x7A, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZWZ", 0xBA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZZWW", 0xFA, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWXX", 0x0E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWXY", 0x4E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWXZ", 0x8E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWXW", 0xCE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWYX", 0x1E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWYY", 0x5E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWYZ", 0x9E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWYW", 0xDE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWZX", 0x2E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWZY", 0x6E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWZZ", 0xAE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWZW", 0xEE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWWX", 0x3E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWWY", 0x7E, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWWZ", 0xBE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "ZWWW", 0xFE, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXXX", 0x03, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXXY", 0x43, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXXZ", 0x83, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXXW", 0xC3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXYX", 0x13, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXYY", 0x53, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXYZ", 0x93, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXYW", 0xD3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXZX", 0x23, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXZY", 0x63, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXZZ", 0xA3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXZW", 0xE3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXWX", 0x33, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXWY", 0x73, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXWZ", 0xB3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WXWW", 0xF3, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYXX", 0x07, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYXY", 0x47, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYXZ", 0x87, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYXW", 0xC7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYYX", 0x17, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYYY", 0x57, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYYZ", 0x97, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYYW", 0xD7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYZX", 0x27, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYZY", 0x67, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYZZ", 0xA7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYZW", 0xE7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYWX", 0x37, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYWY", 0x77, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYWZ", 0xB7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WYWW", 0xF7, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZXX", 0x0B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZXY", 0x4B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZXZ", 0x8B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZXW", 0xCB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZYX", 0x1B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZYY", 0x5B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZYZ", 0x9B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZYW", 0xDB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZZX", 0x2B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZZY", 0x6B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZZZ", 0xAB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZZW", 0xEB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZWX", 0x3B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZWY", 0x7B, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZWZ", 0xBB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WZWW", 0xFB, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWXX", 0x0F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWXY", 0x4F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWXZ", 0x8F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWXW", 0xCF, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWYX", 0x1F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWYY", 0x5F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWYZ", 0x9F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWYW", 0xDF, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWZX", 0x2F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWZY", 0x6F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWZZ", 0xAF, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWZW", 0xEF, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWWX", 0x3F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWWY", 0x7F, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWWZ", 0xBF, DONT_ENUM | DONT_DELETE | READ_ONLY);
  %SetProperty($SIMD, "WWWW", 0xFF, DONT_ENUM | DONT_DELETE | READ_ONLY);

  %ToFastProperties($SIMD);

  // Set up non-enumerable properties of the SIMD float32x4 object.
  InstallFunctions($SIMD.float32x4, DONT_ENUM, $Array(
    // Float32x4 operations
    "abs", SIMDAbs,
    "neg", SIMDNeg,
    "add", SIMDAdd,
    "sub", SIMDSub,
    "mul", SIMDMul,
    "div", SIMDDiv,
    "clamp", SIMDClamp,
    "min", SIMDMin,
    "max", SIMDMax,
    "reciprocal", SIMDReciprocal,
    "reciprocalSqrt", SIMDReciprocalSqrt,
    "scale", SIMDScale,
    "sqrt", SIMDSqrt,
    "and", SIMDAndf32,
    "or", SIMDOrf32,
    "xor", SIMDXorf32,
    "not", SIMDNotf32,
    "shuffle", SIMDShuffle,
    "shuffleMix", SIMDShuffleMix,
    "withX", SIMDWithX,
    "withY", SIMDWithY,
    "withZ", SIMDWithZ,
    "withW", SIMDWithW,
    "lessThan", SIMDLessThan,
    "lessThanOrEqual", SIMDLessThanOrEqual,
    "equal", SIMDEqual,
    "notEqual", SIMDNotEqual,
    "greaterThanOrEqual", SIMDGreaterThanOrEqual,
    "greaterThan", SIMDGreaterThan,
    "bitsToInt32x4", SIMDBitsToInt32x4,
    "toInt32x4", SIMDToInt32x4
  ));

  // Set up non-enumerable properties of the SIMD int32x4 object.
  InstallFunctions($SIMD.int32x4, DONT_ENUM, $Array(
    // Int32x4 operations
    "and", SIMDAnd,
    "or", SIMDOr,
    "xor", SIMDXor,
    "not", SIMDNot,
    "neg", SIMDNegu32,
    "add", SIMDAddu32,
    "sub", SIMDSubu32,
    "mul", SIMDMulu32,
    "select", SIMDSelect,
    "shuffle", SIMDShuffleu32,
    "withX", SIMDWithXu32,
    "withY", SIMDWithYu32,
    "withZ", SIMDWithZu32,
    "withW", SIMDWithWu32,
    "withFlagX", SIMDWithFlagX,
    "withFlagY", SIMDWithFlagY,
    "withFlagZ", SIMDWithFlagZ,
    "withFlagW", SIMDWithFlagW,
    "bitsToFloat32x4", SIMDBitsToFloat32x4,
    "toFloat32x4", SIMDToFloat32x4,
    "lessThan", SIMDLessThanu32,
    "equal", SIMDEqualu32,
    "greaterThan", SIMDGreaterThanu32,
    "shiftLeft", SIMDShiftLeftu32,
    "shiftRight", SIMDShiftRightu32,
    "shiftRightArithmetic", SIMDShiftRightArithmeticu32

  ));

  %SetInlineBuiltinFlag(SIMDLessThanu32);
  %SetInlineBuiltinFlag(SIMDAndf32);
  %SetInlineBuiltinFlag(SIMDOrf32);
  %SetInlineBuiltinFlag(SIMDXorf32);
  %SetInlineBuiltinFlag(SIMDNotf32);
}

SetUpSIMD();

//------------------------------------------------------------------------------

macro FLOAT32x4OrINT32x4_TYPED_ARRAYS(FUNCTION)
// arrayIds below should be synchronized with Runtime_TypedArrayInitialize.
FUNCTION(10, Float32x4Array, 16)
FUNCTION(11, Int32x4Array, 16)
endmacro

macro TYPED_ARRAY_CONSTRUCTOR(ARRAY_ID, NAME, ELEMENT_SIZE)
  function NAMEConstructor(arg1, arg2, arg3) {
    function ConstructByArrayBuffer(obj, buffer, byteOffset, length) {
      var offset = ToPositiveInteger(byteOffset, "invalid_typed_array_length")

      if (offset % ELEMENT_SIZE !== 0) {
        throw MakeRangeError("invalid_typed_array_alignment",
            "start offset", "NAME", ELEMENT_SIZE);
      }
      var bufferByteLength = %ArrayBufferGetByteLength(buffer);
      if (offset > bufferByteLength) {
        throw MakeRangeError("invalid_typed_array_offset");
      }

      var newByteLength;
      var newLength;
      if (IS_UNDEFINED(length)) {
        if (bufferByteLength % ELEMENT_SIZE !== 0) {
          throw MakeRangeError("invalid_typed_array_alignment",
            "byte length", "NAME", ELEMENT_SIZE);
        }
        newByteLength = bufferByteLength - offset;
        newLength = newByteLength / ELEMENT_SIZE;
      } else {
        var newLength = ToPositiveInteger(length, "invalid_typed_array_length");
        newByteLength = newLength * ELEMENT_SIZE;
      }
      if (offset + newByteLength > bufferByteLength) {
        throw MakeRangeError("invalid_typed_array_length");
      }
      %TypedArrayInitialize(obj, ARRAY_ID, buffer, offset, newByteLength);
    }

    function ConstructByLength(obj, length) {
      var l = ToPositiveInteger(length, "invalid_typed_array_length");
      var byteLength = l * ELEMENT_SIZE;
      var buffer = new $ArrayBuffer(byteLength);
      %TypedArrayInitialize(obj, ARRAY_ID, buffer, 0, byteLength);
    }

    function ConstructByArrayLike(obj, arrayLike) {
      var length = arrayLike.length;
      var l = ToPositiveInteger(length, "invalid_typed_array_length");
      if(!%TypedArrayInitializeFromArrayLike(obj, ARRAY_ID, arrayLike, l)) {
        for (var i = 0; i < l; i++) {
          // It is crucial that we let any execptions from arrayLike[i]
          // propagate outside the function.
          obj[i] = arrayLike[i];
        }
      }
    }

    if (%_IsConstructCall()) {
      if (IS_ARRAYBUFFER(arg1)) {
        ConstructByArrayBuffer(this, arg1, arg2, arg3);
      } else if (IS_NUMBER(arg1) || IS_STRING(arg1) ||
                 IS_BOOLEAN(arg1) || IS_UNDEFINED(arg1)) {
        ConstructByLength(this, arg1);
      } else {
        ConstructByArrayLike(this, arg1);
      }
    } else {
      throw MakeTypeError("constructor_not_function", ["NAME"])
    }
  }
endmacro

FLOAT32x4OrINT32x4_TYPED_ARRAYS(TYPED_ARRAY_CONSTRUCTOR)

function Float32x4ArrayGet(i) {
  return this[i];
}

function Float32x4ArraySet(i, v) {
  v = TO_FLOAT32x4(v);
  CHECK_FLOAT32x4(v);
  this[i] = v;
}

function SetUpFloat32x4Array() {
  // Keep synced with typedarray.js.
  SetupTypedArray(global.Float32x4Array, Float32x4ArrayConstructor, 16);

  InstallFunctions(global.Float32x4Array.prototype, DONT_ENUM, $Array(
    "getAt", Float32x4ArrayGet,
    "setAt", Float32x4ArraySet
  ));
}

SetUpFloat32x4Array();

function Int32x4ArrayGet(i) {
  return this[i];
}

function Int32x4ArraySet(i, v) {
  v = TO_INT32x4(v);
  CHECK_INT32x4(v);
  this[i] = v;
}

function SetUpInt32x4Array() {
  // Keep synced with typedarray.js.
  SetupTypedArray(global.Int32x4Array, Int32x4ArrayConstructor, 16);

  InstallFunctions(global.Int32x4Array.prototype, DONT_ENUM, $Array(
    "getAt", Int32x4ArrayGet,
    "setAt", Int32x4ArraySet
  ));
}

SetUpInt32x4Array();

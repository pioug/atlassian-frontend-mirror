"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixMultiply = matrixMultiply;
/**
 * Multiplies a 1x3 row vector with a 3x3 matrix.
 */
function matrixMultiply(row, matrix) {
  var a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
  var b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
  var c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
  return [a, b, c];
}
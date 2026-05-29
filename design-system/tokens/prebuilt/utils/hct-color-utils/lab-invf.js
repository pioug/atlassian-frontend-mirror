"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labInvf = labInvf;
function labInvf(ft) {
  var e = 216.0 / 24389.0;
  var kappa = 24389.0 / 27.0;
  var ft3 = ft * ft * ft;
  if (ft3 > e) {
    return ft3;
  } else {
    return (116 * ft - 16) / kappa;
  }
}
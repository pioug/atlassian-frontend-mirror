"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DiscoverIcon = function DiscoverIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 2a9 9 0 1 1 0-18 9 9 0 0 1 0 18z\" fill-rule=\"nonzero\"/><path d=\"M10.86 10.186l3.896-1.948c1.11-.555 1.562-.108 1.005 1.006l-1.948 3.896c-.126.251-.426.55-.673.673l-3.897 1.948c-1.11.556-1.561.11-1.004-1.006l1.947-3.896c.126-.25.426-.55.673-.673zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z\"/></g></svg>"
  }, props));
};

DiscoverIcon.displayName = 'DiscoverIcon';
var _default = DiscoverIcon;
exports.default = _default;
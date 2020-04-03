"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidRaisedHandIcon = function VidRaisedHandIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M11 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m3 9H8a3 3 0 0 0-3 3v3.7a9.07 9.07 0 0 0 5.9 2.3 9 9 0 0 0 6.1-2.4V15a3 3 0 0 0-3-3\"/><path d=\"M16.6 10.6a.998.998 0 0 0 .2 1.4 1.005 1.005 0 0 0 1.402-.203l1.996-2.661c.333-.443.602-1.25.602-1.808V5.005A1 1 0 0 0 19.8 4c-.552 0-1 .45-1 1.002v2.665l-2.2 2.932z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

VidRaisedHandIcon.displayName = 'VidRaisedHandIcon';
var _default = VidRaisedHandIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Blog24Icon = function Blog24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#2684FF\" fill-rule=\"evenodd\" d=\"M10.998 9.035a3.5 3.5 0 1 0-3.046 3.94c-.473.836-1.096 1.778-1.87 2.827a1.168 1.168 0 0 0 .102 1.506.85.85 0 0 0 1.298-.092c2.675-3.68 3.847-6.407 3.516-8.18zm8.895 0a3.5 3.5 0 1 0-3.046 3.94c-.473.836-1.096 1.778-1.87 2.827a1.168 1.168 0 0 0 .102 1.506.85.85 0 0 0 1.298-.092c2.675-3.68 3.847-6.407 3.516-8.18zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Blog24Icon.displayName = 'Blog24Icon';
var _default = Blog24Icon;
exports.default = _default;
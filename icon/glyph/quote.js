"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var QuoteIcon = function QuoteIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M16.051 6c-1.571 0-2.847 1.312-2.847 2.93 0 1.617 1.276 2.93 2.847 2.93 2.699 0 1.135 5.088-2.269 5.618a.68.68 0 0 0-.578.671c0 .416.372.745.784.682 6.187-.938 8.387-12.83 2.063-12.83M7.848 6C6.275 6 5 7.311 5 8.93c0 1.616 1.275 2.928 2.848 2.928 2.698 0 1.134 5.09-2.27 5.62a.68.68 0 0 0-.578.67c0 .416.372.745.783.682C11.972 17.892 14.172 6 7.848 6\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

QuoteIcon.displayName = 'QuoteIcon';
var _default = QuoteIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BitbucketSnippetsIcon = function BitbucketSnippetsIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M16 9c.8 0 1.6-.3 2.1-.9.6-.6.9-1.3.9-2.1s-.3-1.6-.9-2.1c-1.1-1.1-3.1-1.1-4.2 0-.6.5-.9 1.3-.9 2.1s.3 1.5.8 2L12 11.1 10.2 8c.5-.5.8-1.2.8-2s-.3-1.6-.9-2.1C9 2.7 7 2.7 5.9 3.9 5.3 4.4 5 5.2 5 6s.3 1.6.9 2.1c.6.6 1.3.9 2.1.9h.4l6.7 11.5c.2.3.5.5.9.5.2 0 .3 0 .5-.1.5-.3.6-.9.4-1.4l-3.7-6.4 2.4-4.2c.1.1.3.1.4.1zM8.7 6.7c-.4.4-1 .4-1.4 0-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.2-.2.4-.3.7-.3.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7zm6.6-1.4c.2-.2.4-.3.7-.3.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.4.4-1 .4-1.4 0-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7z\"/><path d=\"M10.3 14.1l-3.1 5.4c-.3.5-.2 1.1.3 1.3.2.1.3.2.5.2.3 0 .7-.2.9-.5l2.6-4.4-1.2-2z\"/></g></svg>"
  }, props));
};

BitbucketSnippetsIcon.displayName = 'BitbucketSnippetsIcon';
var _default = BitbucketSnippetsIcon;
exports.default = _default;
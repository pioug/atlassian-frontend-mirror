"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NewFeature16Icon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" focusable="false" role="presentation"><path fill="#36B37E" fill-rule="evenodd" d="M9 7V4a1 1 0 10-2 0v3H4a1 1 0 100 2h3v3a1 1 0 002 0V9h3a1 1 0 000-2H9zM2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z"/></svg>`
}, props, {
  size: "small"
}));

NewFeature16Icon.displayName = 'NewFeature16Icon';
var _default = NewFeature16Icon;
exports.default = _default;
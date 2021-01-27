"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PullRequest16Icon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" focusable="false" role="presentation"><path fill="#36B37E" fill-rule="evenodd" d="M6.417 6H9a1 1 0 011 1v1a1 1 0 002 0V7a3 3 0 00-3-3H6.415l.294-.295a1 1 0 10-1.413-1.414l-2.003 2a1 1 0 00.001 1.415l2.002 2.001a.999.999 0 001.414-.002.999.999 0 00-.001-1.413L6.417 6zM2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm9 14a2 2 0 100-4 2 2 0 000 4z"/></svg>`
}, props, {
  size: "small"
}));

PullRequest16Icon.displayName = 'PullRequest16Icon';
var _default = PullRequest16Icon;
exports.default = _default;
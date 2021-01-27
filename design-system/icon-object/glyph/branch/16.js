"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Branch16Icon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" focusable="false" role="presentation"><path fill="#2684FF" fill-rule="evenodd" d="M10 8.732v.28A1.993 1.993 0 018.002 11l-.004 2A3.995 3.995 0 0012 9.007v-.274a2 2 0 10-2 0zm-4-3a2 2 0 10-2 0v4.536a2 2 0 102 0V5.732zM2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z"/></svg>`
}, props, {
  size: "small"
}));

Branch16Icon.displayName = 'Branch16Icon';
var _default = Branch16Icon;
exports.default = _default;
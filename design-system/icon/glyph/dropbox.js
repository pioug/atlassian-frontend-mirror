"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DropboxIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path fill="currentColor" fill-rule="evenodd" d="M7 3L2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202L7 3zm5 3.202l5 3.202-5 3.202-5-3.202 5-3.202zm0 13.875l-5-3.202 5-3.202 5 3.202-5 3.202z" clip-rule="evenodd"/></svg>`
}, props));

DropboxIcon.displayName = 'DropboxIcon';
var _default = DropboxIcon;
exports.default = _default;
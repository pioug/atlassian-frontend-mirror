"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AudioCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><circle fill="currentColor" cx="12" cy="12" r="10"/><path d="M16 9.283V13.6h-.003A1.5 1.5 0 1114.5 12c.175 0 .344.03.5.085v-2.08l-4 .431V14.6h-.003A1.5 1.5 0 018 14.5a1.5 1.5 0 012-1.415V9.034c0-.238.186-.451.432-.478l5.136-.553a.38.38 0 01.432.384v.896z" fill="inherit"/></svg>`
}, props));

AudioCircleIcon.displayName = 'AudioCircleIcon';
var _default = AudioCircleIcon;
exports.default = _default;
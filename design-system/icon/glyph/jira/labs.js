"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const JiraLabsIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M10.935 6v4.738L6.997 19h10.005l-3.938-8.262V6h-2.129zm7.873 12.14A2 2 0 0117.002 21H6.997a2 2 0 01-1.805-2.86l3.743-7.854V4h6.13v6.286l3.743 7.853z" fill-rule="nonzero"/><path d="M9 13h6l3 7H6z"/><rect x="8" y="3" width="8" height="2" rx="1"/></g></svg>`
}, props));

JiraLabsIcon.displayName = 'JiraLabsIcon';
var _default = JiraLabsIcon;
exports.default = _default;
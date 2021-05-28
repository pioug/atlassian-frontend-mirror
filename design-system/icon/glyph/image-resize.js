"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ImageResizeIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><rect fill="currentColor" x="3" y="3" width="18" height="18" rx="2"/><path d="M5 14v3.89a1.1 1.1 0 001.1 1.1H10a1 1 0 100-2H7V14a1 1 0 10-2 0z" fill="inherit"/><path d="M5.707 18.121c.39.39 1.027.388 1.41.004L18.125 7.117a.995.995 0 00-.004-1.41 1.001 1.001 0 00-1.41-.004L5.703 16.711a.995.995 0 00.004 1.41z" fill="inherit"/><path d="M17 7v2.99a1 1 0 002 0V6.1A1.1 1.1 0 0017.9 5H14a1 1 0 000 2h3z" fill="inherit"/></g></svg>`
}, props));

ImageResizeIcon.displayName = 'ImageResizeIcon';
var _default = ImageResizeIcon;
exports.default = _default;
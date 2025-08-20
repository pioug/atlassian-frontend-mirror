"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TrayIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path fill-rule="nonzero" d="M5 19h14V5H5zM3 4.995C3 3.893 3.893 3 4.995 3h14.01C20.107 3 21 3.893 21 4.995v14.01A1.995 1.995 0 0 1 19.005 21H4.995A1.995 1.995 0 0 1 3 19.005z"/><path d="M9.17 17H4v1.5c0 .83.67 1.5 1.51 1.5H18.5a1.5 1.5 0 0 0 1.51-1.5V17h-5.17a3 3 0 0 1-5.66 0M7 12h10v2H7zm0-4h10v2H7z"/></g></svg>`
}, props));
TrayIcon.displayName = 'TrayIcon';
var _default = exports.default = TrayIcon;
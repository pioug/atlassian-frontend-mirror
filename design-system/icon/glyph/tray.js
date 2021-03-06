"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TrayIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M5 19h14V5H5v14zM3 4.995C3 3.893 3.893 3 4.995 3h14.01C20.107 3 21 3.893 21 4.995v14.01A1.995 1.995 0 0119.005 21H4.995A1.995 1.995 0 013 19.005V4.995z" fill-rule="nonzero"/><path d="M9.17 17H4v1.5A1.5 1.5 0 005.505 20h12.99c.838 0 1.505-.672 1.505-1.5V17h-5.17a3.001 3.001 0 01-5.66 0zM7 12h10v2H7zm0-4h10v2H7z"/></g></svg>`
}, props));

TrayIcon.displayName = 'TrayIcon';
var _default = TrayIcon;
exports.default = _default;
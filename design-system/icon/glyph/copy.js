"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CopyIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor"><path d="M10 19h8V8h-8zM8 7.992C8 6.892 8.902 6 10.009 6h7.982C19.101 6 20 6.893 20 7.992v11.016c0 1.1-.902 1.992-2.009 1.992H10.01A2 2 0 0 1 8 19.008z"/><path d="M5 16V4.992C5 3.892 5.902 3 7.009 3H15v13zm2 0h8V5H7z"/></g></svg>`
}, props));
CopyIcon.displayName = 'CopyIcon';
var _default = exports.default = CopyIcon;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CrossCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"/><path d="M13.477 9.113l-4.36 4.386a1 1 0 101.418 1.41l4.36-4.386a1 1 0 00-1.418-1.41z" fill="inherit"/><path d="M9.084 10.501l4.358 4.377a1 1 0 101.418-1.411L10.5 9.09a1 1 0 00-1.417 1.411z" fill="inherit"/></g></svg>`
}, props));

CrossCircleIcon.displayName = 'CrossCircleIcon';
var _default = CrossCircleIcon;
exports.default = _default;
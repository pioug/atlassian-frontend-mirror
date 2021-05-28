"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MobileIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#fff" fill-opacity=".01" d="M0 0h24v24H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm10 2H7v13h10V4zm-3 15h-4v1h4v-1z" fill="currentColor"/></svg>`
}, props));

MobileIcon.displayName = 'MobileIcon';
var _default = MobileIcon;
exports.default = _default;
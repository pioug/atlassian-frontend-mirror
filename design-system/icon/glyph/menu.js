"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MenuIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M5 15h14v2H5zm0-8h14v2H5zm0 4h14v2H5z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

MenuIcon.displayName = 'MenuIcon';
var _default = MenuIcon;
exports.default = _default;
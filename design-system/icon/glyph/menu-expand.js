"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MenuExpandIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M6 12c0-.552.456-1 1.002-1h9.996a.999.999 0 110 2H7.002A.999.999 0 016 12zm0 4c0-.552.456-1 1.002-1h9.996a.999.999 0 110 2H7.002A.999.999 0 016 16zm0-8c0-.552.456-1 1.002-1h9.996a.999.999 0 110 2H7.002A.999.999 0 016 8z" fill="currentColor"/></svg>`
}, props));

MenuExpandIcon.displayName = 'MenuExpandIcon';
var _default = MenuExpandIcon;
exports.default = _default;
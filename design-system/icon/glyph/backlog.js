"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BacklogIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor"><path d="M5 19.002C5 19 17 19 17 19v-2.002C17 17 5 17 5 17zm-2-2.004C3 15.894 3.895 15 4.994 15h12.012c1.101 0 1.994.898 1.994 1.998v2.004A1.997 1.997 0 0 1 17.006 21H4.994A2 2 0 0 1 3 19.002z"/><path d="M5 15h12v-2H5zm-2-4h16v6H3z"/><path d="M7 11.002C7 11 19 11 19 11V8.998C19 9 7 9 7 9zM5 8.998C5 7.894 5.895 7 6.994 7h12.012C20.107 7 21 7.898 21 8.998v2.004A1.997 1.997 0 0 1 19.006 13H6.994A2 2 0 0 1 5 11.002z"/><path d="M5 5v2h12V5zm-2-.002C3 3.894 3.895 3 4.994 3h12.012C18.107 3 19 3.898 19 4.998V9H3z"/></g></svg>`
}, props));
BacklogIcon.displayName = 'BacklogIcon';
var _default = exports.default = BacklogIcon;
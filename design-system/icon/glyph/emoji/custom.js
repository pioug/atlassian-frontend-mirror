"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EmojiCustomIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M13 11V7.002a.999.999 0 1 0-2 0V11H7.002a.999.999 0 1 0 0 2H11v3.998a.999.999 0 1 0 2 0V13h3.998a.999.999 0 1 0 0-2z"/></svg>`
}, props));
EmojiCustomIcon.displayName = 'EmojiCustomIcon';
var _default = exports.default = EmojiCustomIcon;
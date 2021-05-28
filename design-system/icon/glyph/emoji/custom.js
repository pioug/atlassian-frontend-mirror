"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EmojiCustomIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M13 11V7.002a.999.999 0 10-2 0V11H7.002a.999.999 0 100 2H11v3.998a.999.999 0 102 0V13h3.998a.999.999 0 100-2H13z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EmojiCustomIcon.displayName = 'EmojiCustomIcon';
var _default = EmojiCustomIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EmojiIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12 3a9 9 0 110 18 9 9 0 010-18zm0 16.071c3.9 0 7.071-3.171 7.071-7.071S15.9 4.929 12 4.929A7.079 7.079 0 004.929 12c0 3.9 3.171 7.071 7.071 7.071zm-1.929-7.714a1.286 1.286 0 11.001-2.572 1.286 1.286 0 010 2.572zm3.858 0a1.286 1.286 0 110-2.572 1.286 1.286 0 010 2.572zm.347 2.035a.805.805 0 011.198 1.073A4.668 4.668 0 0112 16.018a4.666 4.666 0 01-3.469-1.548.804.804 0 011.196-1.074c1.158 1.29 3.393 1.29 4.549-.004z" fill="currentColor"/></svg>`
}, props));

EmojiIcon.displayName = 'EmojiIcon';
var _default = EmojiIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icon = require("../../src/internal/icon.tsx");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Image24Icon = props => /*#__PURE__*/_react.default.createElement(_icon.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ffab00" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m7 17-1.293-1.293a1 1 0 0 0-1.414 0L4 19h16v-3.6l-3.295-3.624a1 1 0 0 0-1.447-.034zm-3.333-6.667a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333"/></svg>`
}, props, {
  size: "medium"
}));
Image24Icon.displayName = 'Image24Icon';
var _default = exports.default = Image24Icon;
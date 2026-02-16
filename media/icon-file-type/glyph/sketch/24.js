"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icon = require("../../src/internal/icon.tsx");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Sketch24Icon = props => /*#__PURE__*/_react.default.createElement(_icon.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff8b00" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m9.03 20c.29-.001.562-.126.752-.343l6.971-8a1 1 0 0 0 .095-1.185l-2.485-4a1 1 0 0 0-.85-.472h-8.84c-.334 0-.646.167-.832.444l-2.674 4a1 1 0 0 0 .081 1.216l7.03 8c.188.216.462.34.75.34"/></svg>`
}, props, {
  size: "medium"
}));
Sketch24Icon.displayName = 'Sketch24Icon';
var _default = exports.default = Sketch24Icon;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AudioIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M19 6.673V15.2a2.8 2.8 0 01-2.8 2.8h-.4a2.8 2.8 0 01-2.8-2.8v-.4a2.8 2.8 0 012.8-2.8h.4c.278 0 .547.04.8.116V8.242l-6 .621V16.2A2.8 2.8 0 018.2 19h-.4A2.8 2.8 0 015 16.2v-.4A2.8 2.8 0 017.8 13h.4c.278 0 .547.04.8.116V6.654c0-.38.31-.721.72-.764l8.56-.886c.398-.041.72.235.72.615v1.054z" fill="currentColor"/></svg>`
}, props));

AudioIcon.displayName = 'AudioIcon';
var _default = AudioIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VidPauseIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M6 4h2a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1zm10 0h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V5a1 1 0 011-1z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

VidPauseIcon.displayName = 'VidPauseIcon';
var _default = VidPauseIcon;
exports.default = _default;
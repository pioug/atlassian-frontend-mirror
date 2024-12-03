"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _video = _interopRequireDefault(require("@atlaskit/icon/core/video"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MediaServicesVideoIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><rect width="16" height="16" x="4" y="4" fill="currentcolor" rx="2"/><path fill="inherit" d="M16.37 14.954 14 13.807v-3.613l2.37-1.148c.285-.138.63.05.63.343v5.222c0 .293-.345.481-.63.343"/><rect width="6" height="6" x="7" y="9" fill="inherit" rx="1"/></g></svg>`
}, props, {
  newIcon: _video.default
}));
MediaServicesVideoIcon.displayName = 'MediaServicesVideoIcon';
var _default = exports.default = MediaServicesVideoIcon;
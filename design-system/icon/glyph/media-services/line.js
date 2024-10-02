"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _borderWeightThin = _interopRequireDefault(require("@atlaskit/icon/core/border-weight-thin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MediaServicesLineIcon = props => /*#__PURE__*/_react.default.createElement(_base.UNSAFE_IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" d="M4.36 17.904 17.904 4.36a1.228 1.228 0 1 1 1.736 1.736L6.096 19.64a1.228 1.228 0 1 1-1.736-1.736"/></svg>`
}, props, {
  newIcon: _borderWeightThin.default
}));
MediaServicesLineIcon.displayName = 'MediaServicesLineIcon';
var _default = exports.default = MediaServicesLineIcon;
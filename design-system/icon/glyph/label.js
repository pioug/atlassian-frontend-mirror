"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _tag = _interopRequireDefault(require("@atlaskit/icon/core/tag"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LabelIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="m11.433 5.428-4.207.6A2 2 0 0 0 5.53 7.727l-.6 4.207a1 1 0 0 0 .281.849l6.895 6.894a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414L12.282 5.71a1 1 0 0 0-.849-.283m-.647 5.858A1.666 1.666 0 1 1 8.43 8.929a1.666 1.666 0 0 1 2.357 2.357"/></svg>`
}, props, {
  newIcon: _tag.default
}));
LabelIcon.displayName = 'LabelIcon';
var _default = exports.default = LabelIcon;
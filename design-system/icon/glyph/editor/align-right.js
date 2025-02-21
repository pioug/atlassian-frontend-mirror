"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _alignTextRight = _interopRequireDefault(require("@atlaskit/icon/core/align-text-right"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorAlignRightIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M7 11h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2m5 4h5a1 1 0 0 1 0 2h-5a1 1 0 0 1 0-2M7 7h10a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2"/></svg>`
}, props, {
  newIcon: _alignTextRight.default
}));
EditorAlignRightIcon.displayName = 'EditorAlignRightIcon';
var _default = exports.default = EditorAlignRightIcon;
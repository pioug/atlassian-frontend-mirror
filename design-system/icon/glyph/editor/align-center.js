"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _alignCenter = _interopRequireDefault(require("@atlaskit/icon/core/align-center"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorAlignCenterIcon = props => /*#__PURE__*/_react.default.createElement(_base.UNSAFE_IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M7 11h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2m2.5 4h5a1 1 0 0 1 0 2h-5a1 1 0 0 1 0-2m0-8h5a1 1 0 0 1 0 2h-5a1 1 0 1 1 0-2"/></svg>`
}, props, {
  newIcon: _alignCenter.default
}));
EditorAlignCenterIcon.displayName = 'EditorAlignCenterIcon';
var _default = exports.default = EditorAlignCenterIcon;
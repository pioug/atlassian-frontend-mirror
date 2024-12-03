"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _layoutOneColumn = _interopRequireDefault(require("@atlaskit/icon/core/layout-one-column"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorLayoutSingleIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><rect width="16" height="14" x="4" y="5" fill="currentcolor" rx="2"/></svg>`
}, props, {
  newIcon: _layoutOneColumn.default
}));
EditorLayoutSingleIcon.displayName = 'EditorLayoutSingleIcon';
var _default = exports.default = EditorLayoutSingleIcon;
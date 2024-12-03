"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _showMoreHorizontal = _interopRequireDefault(require("@atlaskit/icon/core/show-more-horizontal"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorMoreIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M12 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>`
}, props, {
  newIcon: _showMoreHorizontal.default
}));
EditorMoreIcon.displayName = 'EditorMoreIcon';
var _default = exports.default = EditorMoreIcon;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _dragHandleVertical = _interopRequireDefault(require("@atlaskit/icon/core/drag-handle-vertical"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DragHandlerIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><circle cx="10" cy="8" r="1"/><circle cx="14" cy="8" r="1"/><circle cx="10" cy="16" r="1"/><circle cx="14" cy="16" r="1"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/></g></svg>`
}, props, {
  newIcon: _dragHandleVertical.default
}));
DragHandlerIcon.displayName = 'DragHandlerIcon';
var _default = exports.default = DragHandlerIcon;
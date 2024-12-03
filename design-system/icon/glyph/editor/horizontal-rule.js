"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _minus = _interopRequireDefault(require("@atlaskit/icon/core/minus"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorHorizontalRuleIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><rect width="14" height="2" x="5" y="11" fill="currentcolor" fill-rule="evenodd" rx="1"/></svg>`
}, props, {
  newIcon: _minus.default
}));
EditorHorizontalRuleIcon.displayName = 'EditorHorizontalRuleIcon';
var _default = exports.default = EditorHorizontalRuleIcon;
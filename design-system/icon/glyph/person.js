"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _person = _interopRequireDefault(require("@atlaskit/icon/core/person"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PersonIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path d="M6 14c0-1.105.902-2 2.009-2h7.982c1.11 0 2.009.894 2.009 2.006v4.44c0 3.405-12 3.405-12 0z"/><circle cx="12" cy="7" r="4"/></g></svg>`
}, props, {
  newIcon: _person.default
}));
PersonIcon.displayName = 'PersonIcon';
var _default = exports.default = PersonIcon;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _listBulleted = _interopRequireDefault(require("@atlaskit/icon/core/list-bulleted"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BulletListIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><rect width="8" height="2" x="10" y="15" rx="1"/><rect width="2" height="2" x="6" y="15" rx="1"/><rect width="8" height="2" x="10" y="11" rx="1"/><rect width="2" height="2" x="6" y="11" rx="1"/><rect width="8" height="2" x="10" y="7" rx="1"/><rect width="2" height="2" x="6" y="7" rx="1"/></g></svg>`
}, props, {
  newIcon: _listBulleted.default
}));
BulletListIcon.displayName = 'BulletListIcon';
var _default = exports.default = BulletListIcon;
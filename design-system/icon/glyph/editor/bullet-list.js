"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _bulletedList = _interopRequireDefault(require("@atlaskit/icon/core/bulleted-list"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EditorBulletListIcon = props => /*#__PURE__*/_react.default.createElement(_base.UNSAFE_IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentColor" fill-rule="evenodd" d="M6 8c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-5 5c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2m-5 5c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1m5-1h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2"/></svg>`
}, props, {
  newIcon: _bulletedList.default
}));
EditorBulletListIcon.displayName = 'EditorBulletListIcon';
var _default = exports.default = EditorBulletListIcon;
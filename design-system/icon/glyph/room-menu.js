"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RoomMenuIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M14 17h4V7h-4v10zM12 6.007C12 5.45 12.453 5 12.997 5h6.006c.55 0 .997.45.997 1.007v11.986c0 .556-.453 1.007-.997 1.007h-6.006c-.55 0-.997-.45-.997-1.007V6.007z" fill-rule="nonzero"/><rect x="4" y="5" width="6" height="2" rx="1"/><rect x="4" y="9" width="6" height="2" rx="1"/><rect x="4" y="13" width="6" height="2" rx="1"/><rect x="4" y="17" width="6" height="2" rx="1"/></g></svg>`
}, props));

RoomMenuIcon.displayName = 'RoomMenuIcon';
var _default = RoomMenuIcon;
exports.default = _default;
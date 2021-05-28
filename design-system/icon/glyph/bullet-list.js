"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BulletListIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><rect x="10" y="15" width="8" height="2" rx="1"/><rect x="6" y="15" width="2" height="2" rx="1"/><rect x="10" y="11" width="8" height="2" rx="1"/><rect x="6" y="11" width="2" height="2" rx="1"/><rect x="10" y="7" width="8" height="2" rx="1"/><rect x="6" y="7" width="2" height="2" rx="1"/></g></svg>`
}, props));

BulletListIcon.displayName = 'BulletListIcon';
var _default = BulletListIcon;
exports.default = _default;
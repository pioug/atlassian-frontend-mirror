"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PresenceActiveIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><circle cx="12" cy="12" r="6" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

PresenceActiveIcon.displayName = 'PresenceActiveIcon';
var _default = PresenceActiveIcon;
exports.default = _default;
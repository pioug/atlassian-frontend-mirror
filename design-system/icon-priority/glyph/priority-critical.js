"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PriorityCriticalIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M4.671 7.165l6.643-3.946a1.372 1.372 0 011.403.002l6.614 3.944c.415.247.669.695.669 1.178v11.253a1.372 1.372 0 01-2.074 1.179l-5.91-3.52-5.944 3.526A1.372 1.372 0 014 19.6V8.345c0-.484.255-.933.671-1.18z" fill="#FF5630"/></svg>`
}, props));

PriorityCriticalIcon.displayName = 'PriorityCriticalIcon';
var _default = PriorityCriticalIcon;
exports.default = _default;
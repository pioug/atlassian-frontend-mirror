"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TrashIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="M5 5a1 1 0 0 0-1 1v1h16V6a1 1 0 0 0-1-1zm11.15 15h-8.3a1 1 0 0 1-.99-.83L5 8h14l-1.86 11.17a1 1 0 0 1-.99.83M9 4.5a.5.5 0 0 1 .49-.5h5.02a.5.5 0 0 1 .49.5V5H9z"/></svg>`
}, props));
TrashIcon.displayName = 'TrashIcon';
var _default = exports.default = TrashIcon;
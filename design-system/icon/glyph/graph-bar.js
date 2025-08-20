"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const GraphBarIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><rect width="4" height="11" x="17" y="5" rx="2"/><rect width="4" height="8" x="11" y="8" rx="2"/><rect width="4" height="5" x="5" y="11" rx="2"/><path fill-rule="nonzero" d="M21 17H4.995C4.448 17 4 16.548 4 15.991V6a1 1 0 1 0-2 0v9.991A3.004 3.004 0 0 0 4.995 19H21a1 1 0 0 0 0-2"/></g></svg>`
}, props));
GraphBarIcon.displayName = 'GraphBarIcon';
var _default = exports.default = GraphBarIcon;
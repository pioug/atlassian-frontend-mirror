"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GraphBarIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><rect x="17" y="5" width="4" height="11" rx="2"/><rect x="11" y="8" width="4" height="8" rx="2"/><rect x="5" y="11" width="4" height="5" rx="2"/><path d="M21 17H4.995C4.448 17 4 16.548 4 15.991V6a1 1 0 10-2 0v9.991A3.004 3.004 0 004.995 19H21a1 1 0 000-2z" fill-rule="nonzero"/></g></svg>`
}, props));

GraphBarIcon.displayName = 'GraphBarIcon';
var _default = GraphBarIcon;
exports.default = _default;
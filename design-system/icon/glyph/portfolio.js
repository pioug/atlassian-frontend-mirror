"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PortfolioIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8.83 17h6.34a3.001 3.001 0 110 2H8.83a3.001 3.001 0 110-2zM3 5c0-1.105.895-2 1.994-2h12.012C18.107 3 19 3.888 19 5c0 1.105-.895 2-1.994 2H4.994A1.992 1.992 0 013 5zm5 6a2 2 0 012.003-2h8.994a2 2 0 110 4h-8.994A1.996 1.996 0 018 11z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

PortfolioIcon.displayName = 'PortfolioIcon';
var _default = PortfolioIcon;
exports.default = _default;
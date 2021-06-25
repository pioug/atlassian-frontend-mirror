"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PriorityMediumIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M5 8h14a1 1 0 010 2H5a1 1 0 110-2zm0 6h14a1 1 0 010 2H5a1 1 0 010-2z" fill="#FFAB00"/></svg>`
}, props));

PriorityMediumIcon.displayName = 'PriorityMediumIcon';
var _default = PriorityMediumIcon;
exports.default = _default;
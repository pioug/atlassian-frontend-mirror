"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ListIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M3 18c0 .552.445 1 .993 1h16.014A.994.994 0 0021 18v-1H3v1zm0-7h18V9H3zm0-4h18V6c0-.552-.445-1-.993-1H3.993A.994.994 0 003 6v1zm0 8h18v-2H3z" fill="currentColor"/></svg>`
}, props));

ListIcon.displayName = 'ListIcon';
var _default = ListIcon;
exports.default = _default;
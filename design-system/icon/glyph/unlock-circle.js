"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UnlockCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"/><path d="M11 9.99V11h-1V9.98A1.98 1.98 0 0111.98 8h.04A1.98 1.98 0 0114 9.98V11h-1V9.99a.99.99 0 00-.99-.99h-.02a.99.99 0 00-.99.99zm2 .51v.5h1v-.5h-1z" fill="inherit"/><path fill="inherit" d="M10 10h1v2h-1zm-1 5.001a1 1 0 00.99.999h4.02c.546 0 .99-.443.99-.999V13a1 1 0 00-1-1h-4a1 1 0 00-1 1v2.001z"/><rect fill="inherit" x="13" y="10" width="1" height="1" rx=".5"/></g></svg>`
}, props));

UnlockCircleIcon.displayName = 'UnlockCircleIcon';
var _default = UnlockCircleIcon;
exports.default = _default;
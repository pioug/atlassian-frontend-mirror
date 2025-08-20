"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const RetryIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path fill-rule="nonzero" d="M6 10h2.954a1 1 0 0 1 0 2H5.099A1.1 1.1 0 0 1 4 10.9V7a1 1 0 1 1 2 0z"/><path fill-rule="nonzero" d="M7.39 10.09H5.3a8 8 0 1 1 .818 6H7.84v-1.02a6 6 0 1 0-.45-4.98"/><circle cx="7" cy="15.61" r="1"/></g></svg>`
}, props));
RetryIcon.displayName = 'RetryIcon';
var _default = exports.default = RetryIcon;
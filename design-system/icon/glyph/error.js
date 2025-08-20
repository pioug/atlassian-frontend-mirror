"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ErrorIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path fill="currentcolor" d="M13.416 4.417a2 2 0 0 0-2.832 0l-6.168 6.167a2 2 0 0 0 0 2.833l6.168 6.167a2 2 0 0 0 2.832 0l6.168-6.167a2 2 0 0 0 0-2.833z"/><path fill="inherit" d="M12 14a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m0 3a1 1 0 0 1 0-2 1 1 0 0 1 0 2"/></g></svg>`
}, props));
ErrorIcon.displayName = 'ErrorIcon';
var _default = exports.default = ErrorIcon;
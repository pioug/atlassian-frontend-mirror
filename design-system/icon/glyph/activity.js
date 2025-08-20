"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ActivityIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path fill-rule="nonzero" d="M19.004 17C19 17 19 7.006 19 7.006 19 7 4.996 7 4.996 7 5 7 5 16.994 5 16.994 5 17 19.004 17 19.004 17M3 7.006A2 2 0 0 1 4.995 5h14.01A2 2 0 0 1 21 7.006v9.988A2 2 0 0 1 19.005 19H4.995A2 2 0 0 1 3 16.994z"/><path d="M4 6h16v5H4zm5 2c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01C9.455 7 9 7.448 9 8M5 8c0 .556.448 1 1 1 .556 0 1-.448 1-1 0-.556-.448-1-1-1-.556 0-1 .448-1 1"/></g></svg>`
}, props));
ActivityIcon.displayName = 'ActivityIcon';
var _default = exports.default = ActivityIcon;
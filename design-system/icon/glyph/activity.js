"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ActivityIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M19.004 17C19 17 19 7.006 19 7.006 19 7 4.996 7 4.996 7 5 7 5 16.994 5 16.994 5 17 19.004 17 19.004 17zM3 7.006A2 2 0 014.995 5h14.01A2 2 0 0121 7.006v9.988A2 2 0 0119.005 19H4.995A2 2 0 013 16.994V7.006z" fill-rule="nonzero"/><path d="M4 6h16v5H4V6zm5 2c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01C9.455 7 9 7.448 9 8zM5 8c0 .556.448 1 1 1 .556 0 1-.448 1-1 0-.556-.448-1-1-1-.556 0-1 .448-1 1z"/></g></svg>`
}, props));

ActivityIcon.displayName = 'ActivityIcon';
var _default = ActivityIcon;
exports.default = _default;
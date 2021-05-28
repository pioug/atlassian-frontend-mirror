"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ExportIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M13 6.491V16a1 1 0 01-2 0V6.491L9.784 7.697a1.051 1.051 0 01-1.478 0 1.029 1.029 0 010-1.465l2.955-2.929a1.051 1.051 0 011.478 0l2.955 2.93c.408.404.408 1.06 0 1.464a1.051 1.051 0 01-1.478 0L13 6.49zM9 9v2H7c-.002 0 0 7.991 0 7.991 0 .004 9.994.009 9.994.009.003 0 .006-7.991.006-7.991 0-.006-2-.009-2-.009V9h2c1.105 0 2 .902 2 2.009v7.982c0 1.11-.897 2.009-2.006 2.009H7.006A2.009 2.009 0 015 18.991V11.01A2 2 0 017 9h2z" fill="currentColor"/></svg>`
}, props));

ExportIcon.displayName = 'ExportIcon';
var _default = ExportIcon;
exports.default = _default;
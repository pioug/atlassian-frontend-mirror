"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IssueIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M5 15.991c0 .007 14.005.009 14.005.009C18.999 16 19 8.009 19 8.009 19 8.002 4.995 8 4.995 8 5.001 8 5 15.991 5 15.991zM3 8.01C3 6.899 3.893 6 4.995 6h14.01C20.107 6 21 6.902 21 8.009v7.982c0 1.11-.893 2.009-1.995 2.009H4.995A2.004 2.004 0 013 15.991V8.01z" fill-rule="nonzero"/><path d="M10.674 14.331c.36.36.941.36 1.3 0l2.758-2.763a.92.92 0 00-1.301-1.298l-2.108 2.11-.755-.754a.92.92 0 00-1.3 1.3l1.406 1.405z"/></g></svg>`
}, props));

IssueIcon.displayName = 'IssueIcon';
var _default = IssueIcon;
exports.default = _default;
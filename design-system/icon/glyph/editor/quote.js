"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorQuoteIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M15.698 17C16.97 17 18 15.982 18 14.727c0-1.255-1.03-2.273-2.302-2.273-2.301 0-.767-4.393 2.302-4.393V7c-5.478 0-7.624 10-2.302 10zm-4.33-2.273c0-1.255-1.031-2.273-2.301-2.273-2.302 0-.768-4.393 2.301-4.393V7C5.891 7 3.744 17 9.067 17c1.27 0 2.301-1.018 2.301-2.273z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorQuoteIcon.displayName = 'EditorQuoteIcon';
var _default = EditorQuoteIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const JiraCaptureIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12 15a3 3 0 110-6 3 3 0 010 6zm1-12h6c1.136 0 2 1 2 2v6l-2-2V5h-4l-2-2zM3 11V5c0-1.136 1-2 2-2h6L9 5H5v4l-2 2zm8 10H5c-1.136 0-2-1-2-2v-6l2 2v4h4l2 2zm10-8v6c0 1.136-1 2-2 2h-6l2-2h4v-4l2-2z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

JiraCaptureIcon.displayName = 'JiraCaptureIcon';
var _default = JiraCaptureIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorErrorIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentcolor" fill-rule="evenodd" d="m13.485 11.929 2.122-2.121a1 1 0 0 0-1.415-1.415l-2.12 2.122L9.95 8.393a1 1 0 0 0-1.414 1.415l2.12 2.12-2.12 2.122a1 1 0 0 0 1.414 1.414l2.121-2.12 2.121 2.12a1 1 0 1 0 1.415-1.414zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16"/></svg>`
}, props));
EditorErrorIcon.displayName = 'EditorErrorIcon';
var _default = exports.default = EditorErrorIcon;
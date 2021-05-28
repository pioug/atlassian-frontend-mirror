"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorInfoIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12 20a8 8 0 110-16 8 8 0 010 16zm0-8.5a1 1 0 00-1 1V15a1 1 0 002 0v-2.5a1 1 0 00-1-1zm0-1.125a1.375 1.375 0 100-2.75 1.375 1.375 0 000 2.75z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorInfoIcon.displayName = 'EditorInfoIcon';
var _default = EditorInfoIcon;
exports.default = _default;
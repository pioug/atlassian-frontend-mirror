"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorTableIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8 6h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v3h3V8H8zm5 0v3h3V8h-3zm-5 5v3h3v-3H8zm5 0v3h3v-3h-3z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorTableIcon.displayName = 'EditorTableIcon';
var _default = EditorTableIcon;
exports.default = _default;
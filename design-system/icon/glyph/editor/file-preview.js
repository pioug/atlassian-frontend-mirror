"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorFilePreviewIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 18h3a1 1 0 010 2H6a2 2 0 01-2-2v-3a1 1 0 112 0v3zm12 2h-3a1 1 0 010-2h3v-3a1 1 0 012 0v3a2 2 0 01-2 2zM6 4h3a1 1 0 010 2H6v3a1 1 0 01-2 0V6a2 2 0 012-2zm12 2h-3a1 1 0 110-2h3a2 2 0 012 2v3a1 1 0 01-2 0V6z" fill="currentColor"/><path d="M10.55 12.061l-1.873.337a.998.998 0 01-.718-1.713 1 1 0 01.718-.287h3.7c.316-.08.686.021.957.293.272.271.373.641.293.957v3.7a1 1 0 01-2 0l.337-1.873-2.602 2.603c-.345.344-.94.306-1.33-.084-.391-.39-.429-.986-.084-1.33l2.602-2.603z" fill="currentColor"/></svg>`
}, props));

EditorFilePreviewIcon.displayName = 'EditorFilePreviewIcon';
var _default = EditorFilePreviewIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorPhotoIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M5 8.51c0-.282.22-.51.498-.51h13.004c.275 0 .498.228.498.51v8.98c0 .282-.22.51-.498.51H5.498A.504.504 0 015 17.49V8.51zm5-1.01c0-.276.215-.5.49-.5h3.02a.5.5 0 01.49.5V8h-4v-.5zm2 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-1.5a2 2 0 110-4 2 2 0 010 4z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorPhotoIcon.displayName = 'EditorPhotoIcon';
var _default = EditorPhotoIcon;
exports.default = _default;
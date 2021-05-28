"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorImageResizeIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M15 9.707V11h1V8h-3v1h1.293L9 14.293V13H8v3h3v-1H9.707L15 9.707zM6 6.5c0-.276.229-.5.5-.5h11c.276 0 .5.229.5.5v11c0 .276-.229.5-.5.5h-11a.504.504 0 01-.5-.5v-11z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorImageResizeIcon.displayName = 'EditorImageResizeIcon';
var _default = EditorImageResizeIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorIndentIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M9 9H6.49a.495.495 0 00-.49.505v.99c0 .291.22.505.49.505H9v2l3-3-3-3v2zm4-1.495c0-.279.228-.505.491-.505h5.018a.49.49 0 01.491.505v.99a.503.503 0 01-.491.505h-5.018A.49.49 0 0113 8.495v-.99zm0 4c0-.279.228-.505.491-.505h5.018a.49.49 0 01.491.505v.99a.503.503 0 01-.491.505h-5.018a.49.49 0 01-.491-.505v-.99zm-6 4c0-.279.229-.505.5-.505h11c.276 0 .5.214.5.505v.99a.506.506 0 01-.5.505h-11a.495.495 0 01-.5-.505v-.99z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorIndentIcon.displayName = 'EditorIndentIcon';
var _default = EditorIndentIcon;
exports.default = _default;
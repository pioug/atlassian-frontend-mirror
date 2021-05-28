"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorImageIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M11 15l-1-1-2 2h8v-1.8L14 12l-3 3zM6 6.5c0-.276.229-.5.5-.5h11c.276 0 .5.229.5.5v11c0 .276-.229.5-.5.5h-11a.504.504 0 01-.5-.5v-11zM9.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorImageIcon.displayName = 'EditorImageIcon';
var _default = EditorImageIcon;
exports.default = _default;
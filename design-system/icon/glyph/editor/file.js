"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorFileIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M7 6.5c0-.276.228-.5.491-.5H13l4 4v7.5c0 .276-.228.5-.51.5H7.51a.508.508 0 01-.51-.5v-11zm5 1v2.999c0 .271.225.501.501.501H15.5L12 7.5z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorFileIcon.displayName = 'EditorFileIcon';
var _default = EditorFileIcon;
exports.default = _default;
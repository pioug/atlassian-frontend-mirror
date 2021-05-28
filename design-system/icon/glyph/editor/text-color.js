"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorTextColorIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorTextColorIcon.displayName = 'EditorTextColorIcon';
var _default = EditorTextColorIcon;
exports.default = _default;
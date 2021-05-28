"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorHintIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M14 16h-4s0-.5-1-2-2.5-3-2.5-5S7 4 12 4s5.5 3 5.5 5-1.5 3.5-2.5 5-1 2-1 2zm-4 1h4v1l-1.5 2h-1L10 18v-1z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorHintIcon.displayName = 'EditorHintIcon';
var _default = EditorHintIcon;
exports.default = _default;
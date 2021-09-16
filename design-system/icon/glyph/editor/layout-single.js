"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorLayoutSingleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor"/></svg>`
}, props));

EditorLayoutSingleIcon.displayName = 'EditorLayoutSingleIcon';
var _default = EditorLayoutSingleIcon;
exports.default = _default;
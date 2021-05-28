"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorRecentIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M11.305 12.282c.037.09.091.175.165.248l2 2a.75.75 0 001.06-1.06l-1.78-1.78V9a.75.75 0 10-1.5 0v3c0 .104.021.202.059.292zM12 6a6 6 0 110 12 6 6 0 010-12z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorRecentIcon.displayName = 'EditorRecentIcon';
var _default = EditorRecentIcon;
exports.default = _default;
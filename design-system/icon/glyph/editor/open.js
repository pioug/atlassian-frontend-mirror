"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorOpenIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M9.873 7.63c-.28 0-.344.159-.147.357l2.436 2.436-4.386 4.386a.509.509 0 000 .713l.7.7a.495.495 0 00.713.001l4.387-4.386 2.436 2.436c.197.197.357.124.357-.147V8.133a.507.507 0 00-.503-.503H9.873z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorOpenIcon.displayName = 'EditorOpenIcon';
var _default = EditorOpenIcon;
exports.default = _default;
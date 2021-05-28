"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FileIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M17 10.005V19H7V5h5.99v2.49a1.5 1.5 0 001.5 1.5h4.5v-.522c0-.297-.132-.578-.359-.768l-5.074-4.236c-.36-.3-.813-.464-1.282-.464H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-8.995h-2z"/><rect x="8" y="12" width="8" height="2" rx="1"/><rect x="8" y="15" width="4" height="2" rx="1"/></g></svg>`
}, props));

FileIcon.displayName = 'FileIcon';
var _default = FileIcon;
exports.default = _default;
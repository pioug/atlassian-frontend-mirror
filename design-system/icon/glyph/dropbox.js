"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DropboxIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="currentColor" fill-rule="evenodd" d="M7 3L2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202L7 3zm5 3.202l5 3.202-5 3.202-5-3.202 5-3.202zm0 13.875l-5-3.202 5-3.202 5 3.202-5 3.202z" clip-rule="evenodd"/></svg>`
}, props));

DropboxIcon.displayName = 'DropboxIcon';
var _default = DropboxIcon;
exports.default = _default;
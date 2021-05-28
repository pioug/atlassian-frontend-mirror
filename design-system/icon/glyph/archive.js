"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ArchiveIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#fff" fill-opacity=".01" d="M0 0h24v24H0z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19 3H4.85A2 2 0 003 5v4h1v10.45A1.67 1.67 0 005.77 21h12.46A1.67 1.67 0 0020 19.45V9h1V5a2 2 0 00-2-2zm-1 16H6V9h12v10zm1-12H5V5h14v2zm-4 7H9v-2h6v2z" fill="currentColor"/></svg>`
}, props));

ArchiveIcon.displayName = 'ArchiveIcon';
var _default = ArchiveIcon;
exports.default = _default;
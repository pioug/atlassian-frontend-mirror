"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
var _download = _interopRequireDefault(require("@atlaskit/icon/core/download"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DownloadIcon = props => /*#__PURE__*/_react.default.createElement(_base.IconFacade, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path fill-rule="nonzero" d="M10.687 17.292a.983.983 0 0 0-1.397 0 1 1 0 0 0 0 1.407l1.964 1.98a1.08 1.08 0 0 0 1.538 0l1.919-1.933a1 1 0 0 0 0-1.408.983.983 0 0 0-1.398 0l-1.29 1.3z"/><path fill-rule="nonzero" d="M13.001 19.993 13 10.006C13 9.451 12.552 9 12 9s-1 .45-1 1.007l.001 9.987c0 .555.448 1.006 1 1.006s1-.45 1-1.007"/><path d="M7.938 5.48a5 5 0 0 0-.777-.062C4.356 5.418 2 7.62 2 10.498 2 13.409 4.385 16 7.1 16h2.881v-1.993H7.1c-1.657 0-3.115-1.663-3.115-3.508 0-1.778 1.469-3.087 3.104-3.087h.012c.389 0 .686.05.97.15l.17.063c.605.248.875-.246.875-.246l.15-.267c.73-1.347 2.201-2.096 3.716-2.12a4.14 4.14 0 0 1 4.069 3.645l.046.34s.071.525.665.525c.013 0 .012.005.023.005h.254c1.136 0 1.976.959 1.976 2.158 0 1.207-.987 2.342-2.07 2.342h-3.964V16h3.964C20.105 16 22 13.955 22 11.665c0-2-1.312-3.663-3.138-4.074-.707-2.707-3.053-4.552-5.886-4.591-1.975.02-3.901.9-5.038 2.48"/></g></svg>`
}, props, {
  newIcon: _download.default
}));
DownloadIcon.displayName = 'DownloadIcon';
var _default = exports.default = DownloadIcon;
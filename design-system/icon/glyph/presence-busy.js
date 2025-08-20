"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PresenceBusyIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path fill="currentcolor" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12"/><path fill="inherit" d="M9.367 9.363a1.24 1.24 0 0 1 1.747-.008l3.527 3.527c.48.48.48 1.26-.008 1.747a1.24 1.24 0 0 1-1.747.008l-3.527-3.526c-.48-.48-.48-1.26.008-1.748"/></g></svg>`
}, props));
PresenceBusyIcon.displayName = 'PresenceBusyIcon';
var _default = exports.default = PresenceBusyIcon;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _base = require("@atlaskit/icon/base");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PersonCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentcolor" fill-rule="evenodd"><path d="M14.5 13.009h-5c-1.38 0-2.5 1.12-2.5 2.503v3.978a8.95 8.95 0 0 0 5 1.519 8.95 8.95 0 0 0 5-1.519v-3.978a2.5 2.5 0 0 0-2.5-2.503"/><circle cx="12" cy="9" r="3"/><path fill-rule="nonzero" d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10"/></g></svg>`
}, props));
PersonCircleIcon.displayName = 'PersonCircleIcon';
var _default = exports.default = PersonCircleIcon;
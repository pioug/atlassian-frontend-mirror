"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PersonCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M14.5 13.009h-5c-1.38 0-2.5 1.12-2.5 2.503v3.978a8.951 8.951 0 005 1.519 8.95 8.95 0 005-1.519v-3.978a2.502 2.502 0 00-2.5-2.503"/><circle cx="12" cy="9" r="3"/><path d="M12 20a8 8 0 100-16 8 8 0 000 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill-rule="nonzero"/></g></svg>`
}, props));

PersonCircleIcon.displayName = 'PersonCircleIcon';
var _default = PersonCircleIcon;
exports.default = _default;
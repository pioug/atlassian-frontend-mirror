"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PreferencesIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M3 7h3v2H3zm0 8h11v2H3zm7-8h11v2H10zm8 8h3v2h-3z"/><path d="M11 8a3 3 0 11-5.999.001A3 3 0 0111 8zM9 8a1 1 0 10-1.999-.001A1 1 0 009 8zm10 8a3 3 0 11-5.999.001A3 3 0 0119 16zm-2 0a1 1 0 10-1.999-.001A1 1 0 0017 16z"/></g></svg>`
}, props));

PreferencesIcon.displayName = 'PreferencesIcon';
var _default = PreferencesIcon;
exports.default = _default;
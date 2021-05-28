"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PersonWithCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M11.94 12a6.478 6.478 0 00-1.81 4.5c0 1.626.597 3.112 1.583 4.252C8.161 21.448 3 20.68 3 18.446V14c0-1.105.902-2 2.009-2h6.93zM9 11a4 4 0 110-8 4 4 0 010 8zm7.5 11a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-2a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

PersonWithCircleIcon.displayName = 'PersonWithCircleIcon';
var _default = PersonWithCircleIcon;
exports.default = _default;
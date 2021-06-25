"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Calendar24Icon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#FF5630" fill-rule="evenodd" d="M16 6H8V5a1 1 0 10-2 0v1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2V5a1 1 0 00-2 0v1zM3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm3 10v8h12v-8H6z"/></svg>`
}, props, {
  size: "medium"
}));

Calendar24Icon.displayName = 'Calendar24Icon';
var _default = Calendar24Icon;
exports.default = _default;
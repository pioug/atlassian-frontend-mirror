"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Calendar16Icon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#FF5630" fill-rule="evenodd" d="M6 5H4a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H6zM2 0h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2zm8 4v1h2V4a1 1 0 00-2 0zM4 4v1h2V4a1 1 0 00-2 0zm1 4h6v3H5V8z"/></svg>`
}, props, {
  size: "small"
}));

Calendar16Icon.displayName = 'Calendar16Icon';
var _default = Calendar16Icon;
exports.default = _default;
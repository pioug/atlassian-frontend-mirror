"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CalendarFilledIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path d="M19 5h.005C20.107 5 21 5.895 21 6.994v12.012A1.994 1.994 0 0119.005 21H4.995A1.995 1.995 0 013 19.006V6.994C3 5.893 3.892 5 4.995 5H5v1c0 1.112.895 2 2 2 1.112 0 2-.895 2-2V5h6v1c0 1.112.895 2 2 2 1.112 0 2-.895 2-2V5z" fill="currentColor"/><path fill="inherit" d="M7 13.001h2V11H7zm0 4h2V15H7zm4-4h2V11h-2zm0 4h2V15h-2zm4-4h2V11h-2zm0 4h2V15h-2z"/><path d="M16 6V5h2v1a1 1 0 01-2 0zm0-2a1 1 0 012 0v1h-2V4zM6 4a1 1 0 012 0v1H6V4zm0 2V5h2v1a1 1 0 01-2 0z" fill="currentColor"/></g></svg>`
}, props));

CalendarFilledIcon.displayName = 'CalendarFilledIcon';
var _default = CalendarFilledIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MoreVerticalIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><circle cx="12" cy="19" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/></g></svg>`
}, props));

MoreVerticalIcon.displayName = 'MoreVerticalIcon';
var _default = MoreVerticalIcon;
exports.default = _default;
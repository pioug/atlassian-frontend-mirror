"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AddCircleIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"/><path d="M11.046 7.958v3.088H7.958a.954.954 0 100 1.908h3.088v3.088a.954.954 0 101.908 0v-3.088h3.088a.954.954 0 100-1.908h-3.088V7.958a.954.954 0 10-1.908 0z" fill="inherit"/></g></svg>`
}, props));

AddCircleIcon.displayName = 'AddCircleIcon';
var _default = AddCircleIcon;
exports.default = _default;
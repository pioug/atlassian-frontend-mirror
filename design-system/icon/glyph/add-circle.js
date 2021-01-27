"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AddCircleIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"/><path d="M11.046 7.958v3.088H7.958a.954.954 0 100 1.908h3.088v3.088a.954.954 0 101.908 0v-3.088h3.088a.954.954 0 100-1.908h-3.088V7.958a.954.954 0 10-1.908 0z" fill="inherit"/></g></svg>`
}, props));

AddCircleIcon.displayName = 'AddCircleIcon';
var _default = AddCircleIcon;
exports.default = _default;
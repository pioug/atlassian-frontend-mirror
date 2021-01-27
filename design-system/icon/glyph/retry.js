"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const RetryIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M6 10h2.954a1 1 0 010 2H5.099A1.1 1.1 0 014 10.9V7a1 1 0 112 0v3z" fill-rule="nonzero"/><path d="M7.39 10.09H5.3a8 8 0 11.818 6H7.84v-1.02a6 6 0 10-.45-4.98z" fill-rule="nonzero"/><circle cx="7" cy="15.61" r="1"/></g></svg>`
}, props));

RetryIcon.displayName = 'RetryIcon';
var _default = RetryIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const PresenceBusyIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill-rule="evenodd"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z" fill="currentColor"/><path d="M9.367 9.363a1.241 1.241 0 011.747-.008l3.527 3.527c.48.48.48 1.26-.008 1.747a1.241 1.241 0 01-1.747.008l-3.527-3.526c-.48-.48-.48-1.26.008-1.748z" fill="inherit"/></g></svg>`
}, props));

PresenceBusyIcon.displayName = 'PresenceBusyIcon';
var _default = PresenceBusyIcon;
exports.default = _default;
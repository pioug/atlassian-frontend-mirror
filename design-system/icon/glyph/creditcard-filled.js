"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var CreditcardFilledIcon = function CreditcardFilledIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M3 10.988h18V17c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.012zM6.013 16h2v-2h-2v2zM21 8.993V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v1.993\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

CreditcardFilledIcon.displayName = 'CreditcardFilledIcon';
var _default = CreditcardFilledIcon;
exports.default = _default;
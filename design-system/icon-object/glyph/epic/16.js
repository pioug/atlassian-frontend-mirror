"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Epic16Icon = function Epic16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#6554C0\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm9.912 7.767A.486.486 0 0 0 12 7.5a.5.5 0 0 0-.5-.5H9V3.5a.495.495 0 1 0-.872-.327l-.002-.001-3.977 4.973-.008.009-.028.036.002.004A.487.487 0 0 0 4 8.5a.5.5 0 0 0 .5.5c.028 0 .051-.011.077-.016H7V12.5a.5.5 0 0 0 .5.5c.124 0 .234-.05.321-.124l.004.001.007-.009c.03-.027.051-.059.074-.092l3.934-4.913c.019-.018.031-.039.047-.06l.027-.033-.002-.003z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Epic16Icon.displayName = 'Epic16Icon';
var _default = Epic16Icon;
exports.default = _default;
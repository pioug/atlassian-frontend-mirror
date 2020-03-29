"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Changes16Icon = function Changes16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FFAB00\" fill-rule=\"evenodd\" d=\"M10.58 7H5.467l.866-.865A1 1 0 1 0 4.92 4.72L2.34 7.3a.998.998 0 0 0 0 1.414l2.58 2.578a1 1 0 0 0 1.414-1.416L5.456 9h5.134l-.877.876a1 1 0 1 0 1.414 1.415l2.58-2.58a1 1 0 0 0 0-1.414L11.126 4.72a.996.996 0 0 0-.706-.292.999.999 0 0 0-.707 1.707l.866.865zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Changes16Icon.displayName = 'Changes16Icon';
var _default = Changes16Icon;
exports.default = _default;
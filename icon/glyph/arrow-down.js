"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArrowDownIcon = function ArrowDownIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11 6v9.586l-3.793-3.793a.999.999 0 0 0-1.414 0c-.39.39-.39 1.024 0 1.415l5.5 5.499A.993.993 0 0 0 12 19a.993.993 0 0 0 .707-.293l5.5-5.499a1 1 0 1 0-1.414-1.415L13 15.586V6a1 1 0 0 0-2 0z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

ArrowDownIcon.displayName = 'ArrowDownIcon';
var _default = ArrowDownIcon;
exports.default = _default;
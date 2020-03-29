"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArrowRightCircleIcon = function ArrowRightCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><circle fill=\"currentColor\" fill-rule=\"nonzero\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12.314 8.294a1.01 1.01 0 0 0 0 1.422l1.271 1.279H8c-.553 0-1.001.45-1.001 1.005 0 .555.448 1.005 1.001 1.005h5.585l-1.271 1.279a1.01 1.01 0 0 0 0 1.422 1.001 1.001 0 0 0 1.415 0l2.978-2.995a1.01 1.01 0 0 0 0-1.422l-2.978-2.995a.998.998 0 0 0-1.415 0z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

ArrowRightCircleIcon.displayName = 'ArrowRightCircleIcon';
var _default = ArrowRightCircleIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var QuestionIcon = function QuestionIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M12 18a1 1 0 0 1 0-2 1 1 0 0 1 0 2m-2-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0\"/><path d=\"M15.89 8.048a3.971 3.971 0 0 0-2.951-2.94A4.005 4.005 0 0 0 8 9.087a.073.073 0 0 0 .009.008l1.878.022.112-.116A2.002 2.002 0 0 1 12 7c1.103 0 2 .897 2 2 0 1.102-.897 2-2 2h.008a1 1 0 0 0-.998.987v2.014a1 1 0 1 0 2 0v-.782c0-.217.145-.399.349-.472a3.991 3.991 0 0 0 2.53-4.699\"/></g></svg>"
  }, props));
};

QuestionIcon.displayName = 'QuestionIcon';
var _default = QuestionIcon;
exports.default = _default;
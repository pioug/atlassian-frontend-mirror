"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorDecisionIcon = function EditorDecisionIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M9.414 8l3.293 3.293c.187.187.293.442.293.707v5a1 1 0 0 1-2 0v-4.586l-3-3V10.5a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2H9.414zm8.293-1.707a.999.999 0 0 1 0 1.414l-2.5 2.5a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l2.5-2.5a.999.999 0 0 1 1.414 0z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorDecisionIcon.displayName = 'EditorDecisionIcon';
var _default = EditorDecisionIcon;
exports.default = _default;
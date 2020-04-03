"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorFeedbackIcon = function EditorFeedbackIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10.922 14.517L5.87 12.68l-.932-.339C4.418 12.151 4 11.552 4 11c0-.556.42-1.153.938-1.341l9.124-3.318c.52-.19.938.105.938.654v8.01c0 .54-.42.842-.938.654l-3.14-1.142zM6 14.227l2 .728V17c0 .552-.405 1.202-.895 1.447l-.21.106C6.4 18.8 6 18.549 6 18.009v-3.782zm11.224-4.78a.5.5 0 1 1-.448-.894l2-1a.5.5 0 1 1 .448.894l-2 1zm-.448 4a.5.5 0 0 1 .448-.894l2 1a.5.5 0 0 1-.448.894l-2-1zM17 11.5a.5.5 0 1 1 0-1h3a.5.5 0 1 1 0 1h-3z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorFeedbackIcon.displayName = 'EditorFeedbackIcon';
var _default = EditorFeedbackIcon;
exports.default = _default;
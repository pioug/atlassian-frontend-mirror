"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiAtlassianIcon = function EmojiAtlassianIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8.703 11.475c-.237-.253-.61-.239-.767.087L4.05 19.33a.464.464 0 0 0 .415.672h5.412a.448.448 0 0 0 .415-.26c1.167-2.408.46-6.077-1.59-8.267zm2.851-7.065c-2.174 3.443-2.03 7.257-.598 10.12l2.608 5.217c.078.159.24.26.416.26h5.411a.464.464 0 0 0 .416-.671s-7.28-14.567-7.46-14.93c-.167-.325-.583-.332-.793.003z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EmojiAtlassianIcon.displayName = 'EmojiAtlassianIcon';
var _default = EmojiAtlassianIcon;
exports.default = _default;
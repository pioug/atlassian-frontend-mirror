"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesArrowIcon = function MediaServicesArrowIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10.527 11.078l-.842-1.867c-.588-1.305-1.456-1.269-1.942.07l-3.69 10.153c-.164.45.067.676.513.514l10.148-3.692c1.339-.488 1.37-1.357.07-1.944l-1.856-.837c.393-.37.79-.756 1.19-1.156 3.861-3.864 6.448-7.54 5.776-8.213-.672-.672-4.347 1.916-8.209 5.78-.4.4-.787.799-1.158 1.192z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MediaServicesArrowIcon.displayName = 'MediaServicesArrowIcon';
var _default = MediaServicesArrowIcon;
exports.default = _default;
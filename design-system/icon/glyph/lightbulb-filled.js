"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var LightbulbFilledIcon = function LightbulbFilledIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.998 4A5.997 5.997 0 0 0 6 9.998c0 2.218 2.288 4.484 2.288 4.484.39.387.71 1.112.71 1.611 0 .499.45.907 1 .907h4c.55 0 1-.408 1-.907 0-.499.32-1.224.71-1.611 0 0 2.288-2.266 2.288-4.484A5.997 5.997 0 0 0 11.998 4zm2.965 15c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v.003c0 .55.45 1 1 1h4c.55 0 1-.45 1-1V19z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

LightbulbFilledIcon.displayName = 'LightbulbFilledIcon';
var _default = LightbulbFilledIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArrowRightIcon = function ArrowRightIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.793 5.793a.999.999 0 0 0 0 1.414L15.586 11H6a1 1 0 0 0 0 2h9.586l-3.793 3.793a.999.999 0 0 0 0 1.414c.39.39 1.024.39 1.415 0l5.499-5.5a.997.997 0 0 0 .293-.679v-.057a.996.996 0 0 0-.293-.678l-5.499-5.5a1 1 0 0 0-1.415 0z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

ArrowRightIcon.displayName = 'ArrowRightIcon';
var _default = ArrowRightIcon;
exports.default = _default;
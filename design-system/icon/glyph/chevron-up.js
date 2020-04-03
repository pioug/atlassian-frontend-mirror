"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ChevronUpIcon = function ChevronUpIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.221 9.322l-2.929 2.955a1.009 1.009 0 0 0 0 1.419.986.986 0 0 0 1.405 0l2.298-2.317 2.307 2.327a.989.989 0 0 0 1.407 0 1.01 1.01 0 0 0 0-1.419l-2.94-2.965A1.106 1.106 0 0 0 11.991 9c-.279 0-.557.107-.77.322z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

ChevronUpIcon.displayName = 'ChevronUpIcon';
var _default = ChevronUpIcon;
exports.default = _default;
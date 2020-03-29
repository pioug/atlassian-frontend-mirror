"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var StarIcon = function StarIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 16.373l3.98 2.193-.76-4.655 3.276-3.347-4.524-.69L12 5.687l-1.972 4.189-4.524.689L8.78 13.91l-.762 4.655L12 16.373zm0 2.283l-3.016 1.662a2 2 0 0 1-2.939-2.075l.599-3.656-2.57-2.624a2 2 0 0 1 1.129-3.377l3.47-.528 1.518-3.224a2 2 0 0 1 3.618 0l1.519 3.224 3.47.528a2 2 0 0 1 1.127 3.377l-2.569 2.624.599 3.656a2 2 0 0 1-2.94 2.075L12 18.656z\" fill=\"currentColor\"/></svg>"
  }, props));
};

StarIcon.displayName = 'StarIcon';
var _default = StarIcon;
exports.default = _default;
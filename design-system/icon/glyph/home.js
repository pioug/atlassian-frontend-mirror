"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var HomeIcon = function HomeIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M10 19v-4.5a2 2 0 1 1 4 0V19h4a1 1 0 0 0 1-1v-7.831l-6.293-6.296a1 1 0 0 0-1.414 0L5 10.169V18a1 1 0 0 0 1 1h4zm11-6.83V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5.83l-.04.04c-.39.39-1.03.39-1.42 0-.39-.39-.39-1.03 0-1.42l8.339-8.331a3 3 0 0 1 4.242 0l8.339 8.331c.39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0l-.04-.04z\" fill=\"currentColor\"/></svg>"
  }, props));
};

HomeIcon.displayName = 'HomeIcon';
var _default = HomeIcon;
exports.default = _default;
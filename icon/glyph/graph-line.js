"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var GraphLineIcon = function GraphLineIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\"><path d=\"M21 17H4.995C4.448 17 4 16.548 4 15.991V6a1 1 0 1 0-2 0v9.991A3.004 3.004 0 0 0 4.995 19H21a1 1 0 0 0 0-2zm-3-8v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1h-4a1 1 0 0 0 0 2h3z\"/><path d=\"M13.293 13.707a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L14 11.586l-2.293-2.293a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 1.414 1.414L11 11.414l2.293 2.293z\"/></g></svg>"
  }, props));
};

GraphLineIcon.displayName = 'GraphLineIcon';
var _default = GraphLineIcon;
exports.default = _default;
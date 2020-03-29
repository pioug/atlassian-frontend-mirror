"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var StarFilledIcon = function StarFilledIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12.072 17.284l-3.905 2.053a1 1 0 0 1-1.451-1.054l.745-4.349-3.159-3.08a1 1 0 0 1 .554-1.705l4.366-.635 1.953-3.956a1 1 0 0 1 1.794 0l1.952 3.956 4.366.635a1 1 0 0 1 .555 1.705l-3.16 3.08.746 4.349a1 1 0 0 1-1.45 1.054l-3.906-2.053z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

StarFilledIcon.displayName = 'StarFilledIcon';
var _default = StarFilledIcon;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Changes24Icon = function Changes24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FFAB00\" fill-rule=\"evenodd\" d=\"M16.587 15H5a1 1 0 0 0 0 2h11.591l-1.298 1.296a1.001 1.001 0 0 0 1.414 1.416l3.005-3.001a1.002 1.002 0 0 0 0-1.415l-3.005-3.003a.999.999 0 1 0-1.414 1.414L16.587 15zM7.418 7l1.294-1.293a.999.999 0 1 0-1.414-1.414L4.293 7.296a1 1 0 0 0 0 1.415l3.005 3a1 1 0 0 0 1.414-1.415L7.414 9H19a1 1 0 0 0 0-2H7.418zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Changes24Icon.displayName = 'Changes24Icon';
var _default = Changes24Icon;
exports.default = _default;
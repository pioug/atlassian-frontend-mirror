"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var TrashIcon = function TrashIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M5 5a1 1 0 0 0-1 1v1h16V6a1 1 0 0 0-1-1H5zm11.15 15H7.845a1 1 0 0 1-.986-.835L5 8h14l-1.864 11.166a.999.999 0 0 1-.986.834M9 4.5a.5.5 0 0 1 .491-.5h5.018a.5.5 0 0 1 .491.5V5H9v-.5z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

TrashIcon.displayName = 'TrashIcon';
var _default = TrashIcon;
exports.default = _default;
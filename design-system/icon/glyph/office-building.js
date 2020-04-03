"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var OfficeBuildingIcon = function OfficeBuildingIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path d=\"M8 6H5.009C3.902 6 3 6.962 3 8.15v10.7C3 20.04 3.9 21 5.009 21h5.487H8v-2.145c-1.616-.001-3-.003-3-.004 0 0 .005-10.708.009-10.708L8 8.144V6z\" fill-rule=\"nonzero\"/><path d=\"M12 7h2v2h-2zm-6 3h2v2H6zm0 3h2v2H6zm6-3h2v2h-2zm0 3h2v2h-2zm2 3h2v3h-2zm2-9h2v2h-2zm0 3h2v2h-2zm0 3h2v2h-2z\"/><path d=\"M18.991 19C18.998 19 19 4.995 19 4.995c0 .006-7.991.005-7.991.005C11.002 5 11 19 11 19h7.991zM9 4.995C9 3.893 9.902 3 11.009 3h7.982C20.101 3 21 3.893 21 4.995v14.01A2.004 2.004 0 0 1 18.991 21H9V4.995z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

OfficeBuildingIcon.displayName = 'OfficeBuildingIcon';
var _default = OfficeBuildingIcon;
exports.default = _default;
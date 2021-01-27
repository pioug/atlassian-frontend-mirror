"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const EditorSettingsIcon = props => /*#__PURE__*/_react.default.createElement(_Icon.default, _extends({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12.002 15.504a3.502 3.502 0 110-7.004 3.502 3.502 0 010 7.004m6.732-1.987a1.605 1.605 0 01-.001-3.034.386.386 0 00.253-.462 7.2 7.2 0 00-.672-1.604.384.384 0 00-.481-.156c-.31.127-.668.16-1.039.065a1.6 1.6 0 01-1.129-1.124 1.641 1.641 0 01.061-1.043.385.385 0 00-.157-.48 7.225 7.225 0 00-1.59-.665.385.385 0 00-.461.252 1.604 1.604 0 01-3.032 0 .387.387 0 00-.463-.252c-.57.16-1.11.39-1.613.677a.378.378 0 00-.159.468 1.611 1.611 0 01-2.088 2.108.385.385 0 00-.479.158 7.2 7.2 0 00-.67 1.604.386.386 0 00.248.46 1.605 1.605 0 010 3.021.385.385 0 00-.249.46c.143.504.34.986.582 1.44.096.179.318.24.502.156.479-.22 1.08-.213 1.693.191a.881.881 0 01.243.242c.424.643.412 1.272.16 1.76a.381.381 0 00.134.506 7.197 7.197 0 001.697.721.381.381 0 00.459-.251A1.605 1.605 0 0112 17.645c.707 0 1.302.457 1.518 1.09.066.19.265.306.459.251a7.212 7.212 0 001.677-.71.38.38 0 00.134-.508c-.256-.49-.271-1.12.154-1.766a.884.884 0 01.243-.243c.62-.411 1.228-.413 1.71-.185a.384.384 0 00.505-.153c.244-.454.441-.937.585-1.443a.385.385 0 00-.252-.461" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorSettingsIcon.displayName = 'EditorSettingsIcon';
var _default = EditorSettingsIcon;
exports.default = _default;
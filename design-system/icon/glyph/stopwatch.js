"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StopwatchIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M15.587 6.988l.626-.664c.203-.215.481-.324.76-.324.247 0 .496.086.694.262a.982.982 0 01.063 1.414l-.565.6a7 7 0 11-10.33 0l-.564-.6a.981.981 0 01.062-1.414A1.04 1.04 0 017.03 6c.278 0 .556.109.76.324l.624.664a6.955 6.955 0 012.582-.916L10.998 5H10.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-.498l.001 1.071a6.955 6.955 0 012.584.917zM12 18a5 5 0 100-10 5 5 0 000 10zm.368-4.232a.796.796 0 01-1.14-.018.834.834 0 01.018-1.163l2.386-2.355a.796.796 0 011.14.018.834.834 0 01-.018 1.163l-2.386 2.355z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

StopwatchIcon.displayName = 'StopwatchIcon';
var _default = StopwatchIcon;
exports.default = _default;
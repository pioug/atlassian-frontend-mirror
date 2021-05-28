"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TrashIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M5 5a1 1 0 00-1 1v1h16V6a1 1 0 00-1-1H5zm11.15 15H7.845a1 1 0 01-.986-.835L5 8h14l-1.864 11.166a.999.999 0 01-.986.834M9 4.5a.5.5 0 01.491-.5h5.018a.5.5 0 01.491.5V5H9v-.5z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

TrashIcon.displayName = 'TrashIcon';
var _default = TrashIcon;
exports.default = _default;
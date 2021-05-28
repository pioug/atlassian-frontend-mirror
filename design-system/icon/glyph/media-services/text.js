"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MediaServicesTextIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M11 7h2v11h-2zM6 5h12v2H6z"/><path d="M5 5h2v3H5zm5 13h4v2h-4zm7-13h2v3h-2z"/></g></svg>`
}, props));

MediaServicesTextIcon.displayName = 'MediaServicesTextIcon';
var _default = MediaServicesTextIcon;
exports.default = _default;
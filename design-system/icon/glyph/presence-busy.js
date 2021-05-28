"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PresenceBusyIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill-rule="evenodd"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z" fill="currentColor"/><path d="M9.367 9.363a1.241 1.241 0 011.747-.008l3.527 3.527c.48.48.48 1.26-.008 1.747a1.241 1.241 0 01-1.747.008l-3.527-3.526c-.48-.48-.48-1.26.008-1.748z" fill="inherit"/></g></svg>`
}, props));

PresenceBusyIcon.displayName = 'PresenceBusyIcon';
var _default = PresenceBusyIcon;
exports.default = _default;
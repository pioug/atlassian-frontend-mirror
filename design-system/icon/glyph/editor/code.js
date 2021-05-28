"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _base = require("@atlaskit/icon/base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorCodeIcon = props => /*#__PURE__*/_react.default.createElement(_base.Icon, Object.assign({
  dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M10.208 7.308a1.09 1.09 0 010 1.483l-3.515 3.71 3.515 3.708a1.09 1.09 0 010 1.483.957.957 0 01-1.405 0l-3.866-4.08a1.635 1.635 0 010-2.225l3.866-4.08a.957.957 0 011.405 0zm3.584 0a.957.957 0 011.405 0l3.866 4.08c.583.614.583 1.61 0 2.225l-3.866 4.08a.957.957 0 01-1.405 0 1.09 1.09 0 010-1.484l3.515-3.708-3.515-3.71a1.09 1.09 0 010-1.483z" fill="currentColor" fill-rule="evenodd"/></svg>`
}, props));

EditorCodeIcon.displayName = 'EditorCodeIcon';
var _default = EditorCodeIcon;
exports.default = _default;
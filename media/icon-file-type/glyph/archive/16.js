'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.default = void 0;
var _react = _interopRequireDefault(require('react'));
var _icon = require('../../src/internal/icon.tsx');
function _interopRequireDefault(e) {
	return e && e.__esModule ? e : { default: e };
}
const Archive16Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#758195" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m4 3v2h2V3zm2 2v2h2V5zM6 7v2h2V7zm2 2v2h2V9zm-2.307 2v2h2v-2z"/></svg>`,
			},
			props,
			{
				size: 'small',
			},
		),
	);
Archive16Icon.displayName = 'Archive16Icon';
var _default = (exports.default = Archive16Icon);

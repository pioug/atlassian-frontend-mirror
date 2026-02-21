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
const Executable24Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#758195" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m2 13v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5zm1.883-8a1 1 0 0 0-.992.876L5 13h14l-.89-7.124A1 1 0 0 0 17.116 5zM8 15h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2"/></svg>`,
			},
			props,
			{
				size: 'medium',
			},
		),
	);
Executable24Icon.displayName = 'Executable24Icon';
var _default = (exports.default = Executable24Icon);

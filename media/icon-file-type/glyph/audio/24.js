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
const Audio24Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m16 6.673V5.619c0-.38-.322-.656-.72-.615l-8.56.886c-.41.043-.72.383-.72.764v6.462A2.8 2.8 0 0 0 8.2 13h-.4A2.8 2.8 0 0 0 5 15.8v.4A2.8 2.8 0 0 0 7.8 19h.4a2.8 2.8 0 0 0 2.8-2.8V8.863l6-.62v3.873a2.8 2.8 0 0 0-.8-.116h-.4a2.8 2.8 0 0 0-2.8 2.8v.4a2.8 2.8 0 0 0 2.8 2.8h.4a2.8 2.8 0 0 0 2.8-2.8z"/></svg>`,
			},
			props,
			{
				size: 'medium',
			},
		),
	);
Audio24Icon.displayName = 'Audio24Icon';
var _default = (exports.default = Audio24Icon);

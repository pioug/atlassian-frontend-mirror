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
const Folder16Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><g fill="#b3d4ff" fill-rule="evenodd"><path d="M6.667 3H15a1 1 0 0 1 1 1v10.05a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.667a1 1 0 0 1 1 1"/><path d="M0 4.05h16v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1z" style="mix-blend-mode:multiply"/></g></svg>`,
			},
			props,
			{
				size: 'small',
			},
		),
	);
Folder16Icon.displayName = 'Folder16Icon';
var _default = (exports.default = Folder16Icon);

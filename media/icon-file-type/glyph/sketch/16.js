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
const Sketch16Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ff8b00" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6.02 13.333a.67.67 0 0 0 .502-.228L13.17 7.77a.67.67 0 0 0 .063-.79l-1.657-2.666A.67.67 0 0 0 11.01 4H5.116a.67.67 0 0 0-.554.296L2.779 6.963a.67.67 0 0 0 .054.81l4.686 5.334a.67.67 0 0 0 .5.226"/></svg>`,
			},
			props,
			{
				size: 'small',
			},
		),
	);
Sketch16Icon.displayName = 'Sketch16Icon';
var _default = (exports.default = Sketch16Icon);

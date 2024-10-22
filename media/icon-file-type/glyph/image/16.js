'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});
exports.default = void 0;
var _react = _interopRequireDefault(require('react'));
var _base = require('@atlaskit/icon/base');
function _interopRequireDefault(e) {
	return e && e.__esModule ? e : { default: e };
}
const Image16Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_base.UNSAFE_IconFacade,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ffab00" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m4.75 11.75-.543-.543a1 1 0 0 0-1.414 0L3 13h10v-2.25l-1.795-1.974a1 1 0 0 0-1.447-.034zM4.667 6.333a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"/></svg>`,
			},
			props,
			{
				size: 'small',
			},
		),
	);
Image16Icon.displayName = 'Image16Icon';
var _default = (exports.default = Image16Icon);

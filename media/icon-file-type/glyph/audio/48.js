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
const Audio48Icon = (props) =>
	/*#__PURE__*/ _react.default.createElement(
		_icon.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="48" height="64" viewBox="0 0 48 64" role="presentation"><g fill-rule="evenodd"><path fill="#fff" stroke="#091e42" stroke-opacity=".08" d="M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5Z"/><path fill="#ff5630" d="M32.167 25.785v9.948A3.267 3.267 0 0 1 28.9 39h-.467a3.267 3.267 0 0 1-3.266-3.267v-.466A3.267 3.267 0 0 1 28.433 32h.467c.324 0 .638.047.933.135v-4.52l-7 .726V36.9a3.267 3.267 0 0 1-3.266 3.267H19.1a3.267 3.267 0 0 1-3.267-3.267v-.467a3.267 3.267 0 0 1 3.267-3.266h.467q.488.001.933.135v-7.539c0-.444.362-.842.839-.89l9.989-1.035c.463-.048.839.274.839.717z"/></g></svg>`,
			},
			props,
			{
				width: 48,
				height: 64,
			},
		),
	);
Audio48Icon.displayName = 'Audio48Icon';
var _default = (exports.default = Audio48Icon);

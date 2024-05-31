//Using a custom icon for now since Design System Team is in the process of updating the icon set for project griffin.

const _react = _interopRequireDefault(require('react'));
const _base = require('@atlaskit/icon/base');

function _interopRequireDefault(obj: any) {
	return obj && obj.__esModule ? obj : { default: obj };
}

const EditorPasteIcon = (props: any) =>
	/*#__PURE__*/ _react.default.createElement(
		_base.Icon,
		Object.assign(
			{
				dangerouslySetGlyph: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.8293 4C14.4175 2.83481 13.3062 2 12 2C10.6938 2 9.58254 2.83481 9.17071 4H9H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H15H14.8293ZM6 6H8V7C8 7.55228 8.44772 8 9 8H15C15.5523 8 16 7.55228 16 7V6H18V18H6V6ZM12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor"/><rect x="8" y="11" width="8" height="2" rx="1" fill="currentColor"/><rect x="8" y="14" width="5" height="2" rx="1" fill="currentColor"/></svg>`,
			},
			props,
		),
	);

EditorPasteIcon.displayName = 'EditorPasteIcon';

export default EditorPasteIcon;

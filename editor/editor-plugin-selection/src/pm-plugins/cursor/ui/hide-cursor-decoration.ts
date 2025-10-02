import { Decoration } from '@atlaskit/editor-prosemirror/view';

const hideCursorWidgetStyles = `
	position: absolute;
	pointer-events: none;
	width: 0;
	height: 0;
`;

const createHideCursorWidget = () => {
	const span = document.createElement('span');
	span.className = 'ProseMirror-hide-cursor';
	span.setAttribute('style', hideCursorWidgetStyles);
	return span;
};

export const createHideCursorDecoration = () => {
	return Decoration.widget(0, createHideCursorWidget, {
		key: 'hide-cursor-decoration',
		side: -1,
	});
};

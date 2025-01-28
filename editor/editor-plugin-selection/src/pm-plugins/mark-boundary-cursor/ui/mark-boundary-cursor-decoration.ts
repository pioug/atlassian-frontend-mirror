import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

const containerStyle = `
	position: relative;
`;

const caretStyle = `
	position: absolute;
	height: 100%;
	width: 1px;
	left: -0.5px;
	bottom: 0;
	background-color: ${token('color.text')};
`;

const toDOM = () => {
	const container = document.createElement('span');
	container.className = 'ProseMirror-mark-boundary-cursor';
	container.setAttribute('style', containerStyle);

	const caret = document.createElement('div');
	caret.setAttribute('style', caretStyle);
	caret.animate?.(
		[
			{
				opacity: 1,
			},
			{
				opacity: 1,
				offset: 0.5,
			},
			{
				opacity: 0,
				offset: 0.5,
			},
			{
				opacity: 0,
			},
		],
		{
			duration: 1000,
			iterations: Infinity,
		},
	);
	container.appendChild(caret);

	return container;
};

export const createMarkBoundaryCursorDecoration = (pos: number, side: number) => {
	return Decoration.widget(pos, toDOM, { key: 'mark-boundary-cursor', side });
};

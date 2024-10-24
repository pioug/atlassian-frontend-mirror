/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type SelectionType = 'anchor' | 'head';

const selectionMarkerHighlightStyles = {
	content: "''",
	position: 'absolute',
	backgroundImage:
		"url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDMgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMSAxSDBMMSAxLjg1NzE0VjE4LjE0MzNMMCAxOS4wMDA0SDNMMiAxOC4xNDMzVjEuODU3MTRMMyAxSDJIMVoiIGZpbGw9IiM1NzlERkYiLz4KPHJlY3QgeT0iMTkiIHdpZHRoPSIzIiBoZWlnaHQ9IjEiIGZpbGw9IiM1NzlERkYiLz4KPHJlY3Qgd2lkdGg9IjMiIGhlaWdodD0iMSIgZmlsbD0iIzU3OURGRiIvPgo8L3N2Zz4K')",
	top: token('space.0', '0px'),
	bottom: token('space.negative.025', '-2px'),
	backgroundRepeat: 'no-repeat',
	backgroundPositionX: 'center',
	backgroundPositionY: 'center',
	backgroundSize: 'contain',
	aspectRatio: '3/20',
	left: '0px',
	marginLeft: token('space.negative.025'),
	right: '0px',
	marginRight: token('space.negative.025'),
	pointerEvents: 'none',
};

const selectionMarkerCursorStyles = {
	content: "''",
	position: 'absolute',
	background: token('color.text', N500),
	width: '1px',
	display: 'inline-block',
	top: token('space.0', '0px'),
	bottom: token('space.negative.025', '-2px'),
	left: '1px',
	marginLeft: token('space.negative.025'),
	right: '0px',
	marginRight: token('space.negative.025'),
	pointerEvents: 'none',
};

/**
 * Converts a camelCased CSS property name to a hyphenated CSS property name.
 *
 * @param property - CamelCased CSS property name.
 * @returns Hyphenated CSS property name.
 */
function hyphenate(property: string): string {
	return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^ms/, '-ms');
}

type WidgetProps = { type: SelectionType; isHighlight: boolean };

const Widget = ({ type, isHighlight }: WidgetProps) => {
	const span = document.createElement('span');

	const styles = isHighlight ? selectionMarkerHighlightStyles : selectionMarkerCursorStyles;

	for (let [rule, value] of Object.entries(styles)) {
		span.style.setProperty(hyphenate(rule), value);
	}

	span.setAttribute('contentEditable', 'false');
	span.dataset.testid = `selection-marker-${type}-cursor`;

	return span;
};

const toDOM = (type: SelectionType, isHighlight: boolean) => {
	let element = document.createElement('span');
	element.contentEditable = 'false';

	element.setAttribute('style', `position: relative;`);

	element.appendChild(Widget({ type, isHighlight }));

	return element;
};

const containsText = (resolvedPos: ResolvedPos) => {
	const { nodeBefore, nodeAfter } = resolvedPos;
	return nodeBefore?.isInline || nodeAfter?.isInline;
};

export const createWidgetDecoration = (
	resolvedPos: ResolvedPos,
	type: SelectionType,
	selection: Selection,
	isHighlight: boolean,
) => {
	// We don't want the cursor to show if it's not text selection
	// ie. if it's on media selection
	if (
		!(selection instanceof TextSelection) ||
		containsText(resolvedPos) === false ||
		!selection.empty
	) {
		return [];
	}

	return [
		Decoration.widget(resolvedPos.pos, toDOM(type, isHighlight), {
			side: -1,
			key: `${type}WidgetDecoration`,
			stopEvent: () => true,
			ignoreSelection: true,
		}),
	];
};

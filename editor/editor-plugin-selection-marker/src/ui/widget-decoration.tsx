/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
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

const selectionMarkerBlockCursorStyles = {
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

// Same as above but defined as an inline element to avoid breaking long words
const selectionMarkerInlineCursorStyles = {
	content: "''",
	position: 'relative',
	pointerEvents: 'none',
	borderLeft: `${token('border.width')} solid ${token('color.text', N500)}`,
	marginLeft: '-1px',
	left: '0.5px',
};

/**
 * Converts a camelCased CSS property name to a hyphenated CSS property name.
 *
 * @param property - CamelCased CSS property name.
 * @returns Hyphenated CSS property name.
 */
function hyphenate(property: string): string {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^ms/, '-ms');
}

type WidgetProps = { isHighlight: boolean; isInWord: boolean; type: SelectionType };

const Widget = ({ type, isHighlight, isInWord }: WidgetProps) => {
	const span = document.createElement('span');

	const selectionMarkerCursorStyles =
		isInWord && fg('platform_editor_inline_selection_marker_cursor')
			? selectionMarkerInlineCursorStyles
			: selectionMarkerBlockCursorStyles;

	const styles = isHighlight ? selectionMarkerHighlightStyles : selectionMarkerCursorStyles;

	for (const [rule, value] of Object.entries(styles)) {
		span.style.setProperty(hyphenate(rule), value);
	}

	span.setAttribute('contentEditable', 'false');
	span.dataset.testid = `selection-marker-${type}-cursor`;

	return span;
};

const toDOM = (type: SelectionType, isHighlight: boolean, isInWord: boolean) => {
	const element = document.createElement('span');
	element.contentEditable = 'false';

	element.setAttribute('style', `position: relative;`);

	element.appendChild(Widget({ type, isHighlight, isInWord }));

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

	let isInWord = false;
	if (fg('platform_editor_inline_selection_marker_cursor')) {
		// We're inside a word if the parent, before, and after nodes are all text nodes
		// and the before/after nodes are appended/prepended with non-whitespace characters
		// Also if we're making a selection and not just a cursor, this isn't relevant
		const { nodeBefore, nodeAfter, parent } = resolvedPos;
		// Check if the parent is a text node and the before/after nodes are also text nodes
		const areTextNodes = parent.isTextblock && nodeBefore?.isText && nodeAfter?.isText;
		const lastCharacterOfBeforeNode = nodeBefore?.textContent?.slice(-1);
		const firstCharacterOfAfterNode = nodeAfter?.textContent?.slice(0, 1);
		const areAdjacentCharactersNonWhitespace =
			// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
			/\S/u.test(lastCharacterOfBeforeNode || '') && /\S/u.test(firstCharacterOfAfterNode || '');
		isInWord = Boolean(areTextNodes && areAdjacentCharactersNonWhitespace);
	}

	return [
		Decoration.widget(resolvedPos.pos, toDOM(type, isHighlight, isInWord), {
			side: -1,
			key: `${type}WidgetDecoration`,
			stopEvent: () => true,
			ignoreSelection: true,
		}),
	];
};

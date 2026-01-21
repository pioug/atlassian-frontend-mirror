import { foldGutter, codeFolding, foldState, foldEffect } from '@codemirror/language';
import { type StateEffect } from '@codemirror/state';
import type { EditorView as CodeMirror } from '@codemirror/view';

import {
	setCodeBlockFoldState,
	type FoldRange,
	getCodeBlockFoldState,
} from '@atlaskit/editor-common/code-block';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

// Based on platform/packages/design-system/icon/svgs/utility/add.svg
const chevronDown: DOMOutputSpec = [
	'http://www.w3.org/2000/svg svg',
	{
		width: '12',
		height: '12',
		fill: 'none',
		viewBox: '0 0 16 16',
		style: 'pointer-events: none;',
	},
	[
		'http://www.w3.org/2000/svg path',
		{
			fill: 'currentcolor',
			'fill-rule': 'evenodd',
			d: 'm14.53 6.03-6 6a.75.75 0 0 1-1.004.052l-.056-.052-6-6 1.06-1.06L8 10.44l5.47-5.47z',
			'clip-rule': 'evenodd',
			style: 'pointer-events: none;',
		},
	],
];

const chevronRight: DOMOutputSpec = [
	'http://www.w3.org/2000/svg svg',
	{
		width: '12',
		height: '12',
		fill: 'none',
		viewBox: '0 0 16 16',
		style: 'pointer-events: none;',
	},
	[
		'http://www.w3.org/2000/svg path',
		{
			fill: 'currentcolor',
			'fill-rule': 'evenodd',
			d: 'm8.28 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L12.69 8 7.22 2.53z',
			'clip-rule': 'evenodd',
			style: 'pointer-events: none;',
		},
	],
];

export function foldGutterExtension({
	selectNode,
	getNode,
}: {
	getNode: () => PMNode;
	selectNode: () => void;
}) {
	return [
		foldGutter({
			foldingChanged: (update) => {
				const folds = update.state.field(foldState, false);
				if (!folds) {
					return false;
				}
				const foldRanges: FoldRange[] = [];

				folds.between(0, update.state.doc.length, (from, to) => {
					foldRanges.push({ from, to });
				});

				setCodeBlockFoldState(getNode(), foldRanges);
				return false;
			},
			domEventHandlers: {
				click: (_view, _, event) => {
					// If we're trying to click the button, don't select
					if (
						event.target instanceof HTMLButtonElement &&
						event.target.getAttribute('data-marker-dom-element')
					) {
						return false;
					}
					selectNode();
					return false;
				},
			},
			markerDOM: (open) => {
				const { dom: downElement } = DOMSerializer.renderSpec(document, chevronDown);
				const { dom: rightElement } = DOMSerializer.renderSpec(document, chevronRight);
				const htmlElement = document.createElement('button');
				htmlElement.setAttribute('data-marker-dom-element', 'true');
				htmlElement.setAttribute(
					'data-testid',
					`code-block-fold-button-${open ? 'open' : 'closed'}`,
				);
				if (fg('platform_editor_a11y_code_block_gutter_focus_fix')) {
					htmlElement.setAttribute('tabindex', '-1');
				}
				htmlElement.setAttribute(
					'style',
					convertToInlineCss({
						background: 'none',
						color: 'inherit',
						border: 'none',
						padding: 0,
						paddingRight: token('space.050'),
						font: 'inherit',
						outline: 'inherit',
						cursor: 'pointer',
					}),
				);

				if (open) {
					if (downElement) {
						htmlElement.appendChild(downElement);
					} else {
						// Fallback - never called
						htmlElement.textContent = '⌄';
					}
				} else {
					if (rightElement) {
						htmlElement.appendChild(rightElement);
					} else {
						// Fallback - never called
						htmlElement.textContent = '>';
					}
				}

				return htmlElement;
			},
		}),
		codeFolding({
			placeholderDOM(view, onclick, _prepared) {
				const htmlElement = document.createElement('button');
				htmlElement.setAttribute('data-marker-dom-element', 'true');
				if (fg('platform_editor_a11y_code_block_gutter_focus_fix')) {
					htmlElement.setAttribute('tabindex', '-1');
				}
				htmlElement.setAttribute(
					'style',
					convertToInlineCss({
						color: 'inherit',
						font: 'inherit',
						cursor: 'pointer',
					}),
				);
				htmlElement.textContent = '…';
				htmlElement.className = 'cm-foldPlaceholder';
				htmlElement.onclick = onclick;
				return htmlElement;
			},
		}),
	];
}

export function getCodeBlockFoldStateEffects({
	node,
	cm,
}: {
	cm: CodeMirror;
	node: PMNode;
}): StateEffect<unknown>[] | undefined {
	const savedFolds = getCodeBlockFoldState(node);
	if (savedFolds.length === 0) {
		return undefined;
	}

	// Create fold effects for each saved fold range
	const effects = [];
	for (const foldRange of savedFolds) {
		// Validate that the fold range is still valid for the current document
		const docLength = cm.state.doc.length;
		if (foldRange.from >= 0 && foldRange.to <= docLength && foldRange.from < foldRange.to) {
			effects.push(foldEffect.of({ from: foldRange.from, to: foldRange.to }));
		}
	}
	return effects;
}

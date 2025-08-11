import { foldGutter, codeFolding } from '@codemirror/language';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
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

export function foldGutterExtension({ selectNode }: { selectNode: () => void }) {
	return [
		foldGutter({
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
			placeholderDOM(view, onclick, prepared) {
				const htmlElement = document.createElement('button');
				htmlElement.setAttribute('data-marker-dom-element', 'true');
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

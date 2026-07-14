import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getEditorDomSize } from '../../../utils/getEditorDomSize';

// getEditorDomSize only reads `view.dom`, so a minimal stub is enough.
const viewWithDom = (dom: HTMLElement): EditorView => ({ dom }) as unknown as EditorView;

describe('getEditorDomSize', () => {
	it('returns 0 for an editor DOM with no descendant elements', () => {
		const dom = document.createElement('div');

		expect(getEditorDomSize(viewWithDom(dom))).toBe(0);
	});

	it('counts all descendant elements but not the root itself', () => {
		const dom = document.createElement('div');
		dom.innerHTML = '<p><strong>a</strong></p><p>b</p>';

		// 2x <p> + 1x <strong> = 3 descendants (the root <div> is excluded)
		expect(getEditorDomSize(viewWithDom(dom))).toBe(3);
	});

	it('does not count text nodes, only elements', () => {
		const dom = document.createElement('div');
		dom.textContent = 'plain text with no child elements';

		expect(getEditorDomSize(viewWithDom(dom))).toBe(0);
	});

	it('counts deeply nested elements (non-recursive traversal, no stack overflow)', () => {
		const dom = document.createElement('div');
		let current: HTMLElement = dom;
		const depth = 5000;
		for (let i = 0; i < depth; i++) {
			const span = document.createElement('span');
			current.appendChild(span);
			current = span;
		}

		expect(getEditorDomSize(viewWithDom(dom))).toBe(depth);
	});

	it('reads from the passed EditorView.dom so each editor instance is counted independently', () => {
		const domA = document.createElement('div');
		domA.appendChild(document.createElement('p'));

		const domB = document.createElement('div');
		domB.appendChild(document.createElement('p'));
		domB.appendChild(document.createElement('p'));

		expect(getEditorDomSize(viewWithDom(domA))).toBe(1);
		expect(getEditorDomSize(viewWithDom(domB))).toBe(2);
	});
});

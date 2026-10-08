import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getPosFromRange } from '../../index';

describe.each([true, false])('extension comment targeting with gate enabled: %s', (enabled) => {
	beforeEach(() => {
		(enabled ? passGate : failGate)('cc_maui_annotations_on_extensions');
	});

	it.each([1, 10])('handles a selected extension at renderer position %s', (startPos) => {
		const root = document.createElement('div');
		root.className = 'ak-renderer-document';
		const extension = root.appendChild(document.createElement('div'));
		extension.className = 'ak-renderer-extension';
		extension.dataset.inlineCommentsTarget = 'true';
		extension.dataset.rendererStartPos = String(startPos);
		const range = document.createRange();
		range.selectNode(extension);

		expect(getPosFromRange(range)).toEqual(
			enabled ? { from: startPos - 1, to: startPos - 1 } : false,
		);
	});

	it('preserves text range positions', () => {
		const paragraph = document.createElement('p');
		paragraph.dataset.rendererStartPos = '1';
		const text = paragraph.appendChild(document.createTextNode('Hello world'));
		const range = document.createRange();
		range.setStart(text, 1);
		range.setEnd(text, 5);

		expect(getPosFromRange(range)).toEqual({ from: 2, to: 6 });
	});

	it('preserves media hover positions', () => {
		const mediaSingle = document.createElement('div');
		mediaSingle.dataset.nodeType = 'mediaSingle';
		mediaSingle.dataset.rendererStartPos = '10';
		const media = mediaSingle.appendChild(document.createElement('div'));
		const range = document.createRange();
		range.selectNodeContents(media);

		expect(getPosFromRange(range)).toEqual({ from: 10, to: 10 });
	});
});

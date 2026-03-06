import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import * as steps from '../../../steps';
import { getSelectionContext } from '../../selection';

const createPmDoc = () =>
	defaultSchema.nodeFromJSON({
		type: 'doc',
		version: 1,
		content: [
			{
				type: 'paragraph',
				attrs: { localId: 'local-1' },
				content: [{ type: 'text', text: 'Hello brave world' }],
			},
			{
				type: 'paragraph',
				attrs: { localId: 'local-2' },
				content: [{ type: 'text', text: 'Second line' }],
			},
		],
	});

const getParagraphStartPositions = (doc: PMNode): number[] => {
	const positions: number[] = [];
	doc.descendants((node, pos) => {
		if (node.type.name === 'paragraph') {
			positions.push(pos);
		}
		return true;
	});
	return positions;
};

const setSelectionRange = ({
	startNode,
	startOffset,
	endNode,
	endOffset,
}: {
	endNode: Node;
	endOffset: number;
	startNode: Node;
	startOffset: number;
}): Range => {
	const range = document.createRange();
	range.setStart(startNode, startOffset);
	range.setEnd(endNode, endOffset);
	const selection = window.getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
	return range;
};

const setupRendererDom = (doc: PMNode) => {
	const [firstStartPos, secondStartPos] = getParagraphStartPositions(doc);

	const root = document.createElement('div');
	root.className = 'ak-renderer-document';

	const firstBlock = document.createElement('p');
	firstBlock.dataset.rendererStartPos = String(firstStartPos);
	firstBlock.dataset.localId = 'local-1';
	const firstPrefix = document.createTextNode('Hello ');
	const marked = document.createElement('strong');
	marked.dataset.rendererMark = 'true';
	const markedText = document.createTextNode('brave');
	marked.append(markedText);
	const firstSuffix = document.createTextNode(' world');
	firstBlock.append(firstPrefix, marked, firstSuffix);

	const secondBlock = document.createElement('p');
	secondBlock.dataset.rendererStartPos = String(secondStartPos);
	secondBlock.dataset.localId = 'local-2';
	const secondText = document.createTextNode('Second line');
	secondBlock.append(secondText);

	root.append(firstBlock, secondBlock);
	document.body.append(root);

	return {
		firstStartPos,
		secondStartPos,
		firstPrefix,
		markedText,
		firstSuffix,
		secondText,
	};
};

describe('selection actions helper', () => {
	afterEach(() => {
		window.getSelection()?.removeAllRanges();
		document.body.innerHTML = '';
		jest.restoreAllMocks();
	});

	it('returns null when there is no DOM range selection', () => {
		const doc = createPmDoc();
		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns null when doc is missing', () => {
		expect(getSelectionContext({ schema: defaultSchema })).toBeNull();
	});

	it('returns null when schema is missing', () => {
		const doc = createPmDoc();
		expect(getSelectionContext({ doc })).toBeNull();
	});

	it('returns null when DOM selection is collapsed', () => {
		const doc = createPmDoc();
		const { markedText } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 2,
			endNode: markedText,
			endOffset: 2,
		});

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns null when DOM selection is not a single range', () => {
		const doc = createPmDoc();
		const getSelectionSpy = jest.spyOn(document, 'getSelection').mockReturnValue({
			type: 'Range',
			rangeCount: 2,
		} as Selection);

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
		expect(getSelectionSpy).toHaveBeenCalled();
		getSelectionSpy.mockRestore();
	});

	it('returns null when selected DOM nodes have no renderer start positions', () => {
		const doc = createPmDoc();
		const root = document.createElement('div');
		root.className = 'ak-renderer-document';
		const node = document.createElement('span');
		node.textContent = 'No start position';
		root.append(node);
		document.body.append(root);

		setSelectionRange({
			startNode: node.firstChild as Node,
			startOffset: 0,
			endNode: node.firstChild as Node,
			endOffset: 5,
		});

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns selection context for valid nested inline mark selection', () => {
		const doc = createPmDoc();
		const { markedText, firstSuffix } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 0,
			endNode: firstSuffix,
			endOffset: 4,
		});

		const selection = getSelectionContext({ doc, schema: defaultSchema });

		expect(selection).toEqual(
			expect.objectContaining({
				localIds: ['local-1'],
				selectionMarkdown: null,
				startIndex: 6,
				endIndex: 15,
			}),
		);
		expect(selection?.selectionFragment).toEqual(
			expect.arrayContaining([expect.objectContaining({ type: 'paragraph' })]),
		);
	});

	it('normalizes reversed PM positions into the same context output', () => {
		const doc = createPmDoc();
		const { markedText, firstSuffix, firstStartPos } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 0,
			endNode: firstSuffix,
			endOffset: 4,
		});
		jest.spyOn(steps, 'getPosFromRange').mockReturnValue({
			from: firstStartPos + 15,
			to: firstStartPos + 6,
		});

		const selection = getSelectionContext({ doc, schema: defaultSchema });

		expect(selection).toEqual(
			expect.objectContaining({
				localIds: ['local-1'],
				startIndex: 6,
				endIndex: 15,
			}),
		);
		expect(selection?.selectionFragment).not.toBeNull();
	});

	it('returns multiple localIds and non-empty fragment for cross-block selections', () => {
		const doc = createPmDoc();
		const { firstPrefix, secondText } = setupRendererDom(doc);
		setSelectionRange({
			startNode: firstPrefix,
			startOffset: 3,
			endNode: secondText,
			endOffset: 6,
		});

		const selection = getSelectionContext({ doc, schema: defaultSchema });

		expect(selection).toEqual(
			expect.objectContaining({
				localIds: ['local-1', 'local-2'],
				startIndex: 3,
				endIndex: 6,
			}),
		);
		expect(selection?.selectionFragment?.length).toBeGreaterThan(0);
	});

	it('returns null when getPosFromRange returns false', () => {
		const doc = createPmDoc();
		const { markedText, firstSuffix } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 0,
			endNode: firstSuffix,
			endOffset: 3,
		});
		jest.spyOn(steps, 'getPosFromRange').mockReturnValue(false);

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns null when normalized PM range has zero width', () => {
		const doc = createPmDoc();
		const { markedText, firstStartPos } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 0,
			endNode: markedText,
			endOffset: 4,
		});
		jest.spyOn(steps, 'getPosFromRange').mockReturnValue({
			from: firstStartPos + 2,
			to: firstStartPos + 2,
		});

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns null when TextSelection.create throws', () => {
		const doc = createPmDoc();
		const { markedText, firstSuffix } = setupRendererDom(doc);
		setSelectionRange({
			startNode: markedText,
			startOffset: 0,
			endNode: firstSuffix,
			endOffset: 3,
		});
		jest.spyOn(TextSelection, 'create').mockImplementation(() => {
			throw new Error('selection failed');
		});

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});

	it('returns null when computed indices are negative', () => {
		const doc = createPmDoc();
		const { secondText } = setupRendererDom(doc);
		setSelectionRange({
			startNode: secondText,
			startOffset: 1,
			endNode: secondText,
			endOffset: 4,
		});
		jest.spyOn(steps, 'getPosFromRange').mockReturnValue({
			from: 1,
			to: 4,
		});

		expect(getSelectionContext({ doc, schema: defaultSchema })).toBeNull();
	});
});

import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { createProseMirrorMetadata } from './index'; // Replace with the correct file path

describe('createProseMirrorMetadata', () => {
	it('should create metadata for a node', () => {
		const mockNode = {
			type: { name: 'paragraph', isBlock: true, isInline: false },
			marks: [],
		} as unknown as PMNode;

		const metadata = createProseMirrorMetadata(mockNode);
		expect(metadata).toEqual({
			'data-prosemirror-content-type': 'node',
			'data-prosemirror-node-name': 'paragraph',
			'data-prosemirror-node-block': 'true',
		});
	});

	it('should create metadata for a mark', () => {
		const mockMark = {
			type: { name: 'bold' },
		} as unknown as PMMark;

		const metadata = createProseMirrorMetadata(mockMark);
		expect(metadata).toEqual({
			'data-prosemirror-content-type': 'mark',
			'data-prosemirror-mark-name': 'bold',
		});
	});
});

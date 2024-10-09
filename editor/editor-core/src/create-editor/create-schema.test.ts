import type {
	DOMOutputSpec,
	Mark as PMMark,
	Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';

import { addMetadataAttributes, wrapNodeSpecProxy, wrapToDOMProxy } from './create-schema'; // Replace with the correct file path

describe('addMetadataAttributes', () => {
	it('should add metadata to a DOMOutputSpec array', () => {
		const mockNode = {
			type: { name: 'paragraph' },
			marks: [],
		} as unknown as PMNode;
		const domSpec: DOMOutputSpec = ['div', 0];
		const result = addMetadataAttributes({ nodeOrMark: mockNode, domSpec });

		expect(result).toEqual(expect.any(Array));
		// Already cheking above
		// @ts-expect-error
		expect(result[1]).toEqual({
			'data-prosemirror-content-type': 'node',
			'data-prosemirror-node-name': 'paragraph',
		});
	});

	it('should not modify non-array DOMOutputSpec', () => {
		const mockNode = {
			type: { name: 'paragraph' },
			marks: [],
		} as unknown as PMNode;
		const domSpec = { dom: document.createElement('div') };
		const result = addMetadataAttributes({ nodeOrMark: mockNode, domSpec });
		expect(result).toBe(domSpec);
	});
});

describe('wrapToDOMProxy', () => {
	it('should wrap a toDOM function and add metadata', () => {
		const toDOM: (node: PMNode | PMMark) => DOMOutputSpec = jest.fn((node) => ['span', 0]);

		const wrappedToDOM = wrapToDOMProxy(toDOM);

		const mockNode = {
			type: { name: 'text' },
			marks: [],
		} as unknown as PMNode;
		const result = wrappedToDOM(mockNode);

		expect(toDOM).toHaveBeenCalledWith(mockNode);

		expect(result).toEqual(expect.any(Array));
		// Already cheking above
		// @ts-expect-error
		expect(result[1]).toEqual({
			'data-prosemirror-content-type': 'node',
			'data-prosemirror-node-name': 'text',
		});
	});
});

describe('wrapNodeSpecProxy', () => {
	it('should wrap a NodeSpec with a proxied toDOM function', () => {
		const spec: Record<'toDOM', (node: PMNode | PMMark) => DOMOutputSpec> = {
			toDOM: jest.fn((node) => ['p', 0]),
		};

		const wrappedSpec = wrapNodeSpecProxy(spec);
		const mockNode = {
			type: { name: 'paragraph' },
			marks: [],
		} as unknown as PMNode;
		const result = wrappedSpec.toDOM(mockNode);

		expect(spec.toDOM).toHaveBeenCalledWith(mockNode);
		// Already cheking above
		// @ts-expect-error
		expect(result[1]).toEqual({
			'data-prosemirror-content-type': 'node',
			'data-prosemirror-node-name': 'paragraph',
		});
	});
});

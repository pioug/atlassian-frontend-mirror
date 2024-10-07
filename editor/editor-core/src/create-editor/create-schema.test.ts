import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { wrapNodeSpecProxy, wrapToDOMProxy } from './create-schema';

describe('wrapToDOMProxy', () => {
	it('should return a proxy that modifies the toDOM function', () => {
		const mockToDOM = jest.fn((node: PMNode): DOMOutputSpec => ['div', { class: 'test' }]);
		const proxyToDOM = wrapToDOMProxy(mockToDOM);

		const node = {
			type: { name: 'paragraph', isBlock: true },
		} as unknown as PMNode;

		const result = proxyToDOM(node);

		expect(mockToDOM).toHaveBeenCalledWith(node);
		expect(result).toEqual([
			'div',
			{
				class: 'test',
				'data-prosemirror-node-name': 'paragraph',
				'data-prosemirror-node-block': true,
			},
		]);
	});

	it('should handle non-array results from toDOM', () => {
		const mockToDOM = jest.fn((node) => 'string-result');
		const proxyToDOM = wrapToDOMProxy(mockToDOM);

		const node = {
			type: { name: 'inline', isBlock: false },
		} as unknown as PMNode;

		const result = proxyToDOM(node);

		expect(result).toBe('string-result');
	});
});

describe('wrapNodeSpecProxy', () => {
	it('should wrap the toDOM method in a NodeSpec', () => {
		const mockToDOM = jest.fn((node) => ['span', {}]);
		const nodeSpec = { toDOM: mockToDOM } as unknown as NodeSpec;
		const proxyNodeSpec = wrapNodeSpecProxy(nodeSpec);

		const node = {
			type: { name: 'inline', isBlock: false },
		} as unknown as PMNode;

		const result = proxyNodeSpec.toDOM!(node);

		expect(result).toEqual(['span', { 'data-prosemirror-node-name': 'inline' }]);
	});

	it('should not modify other properties', () => {
		const nodeSpec = {
			toDOM: jest.fn(),
			anotherProperty: 'test-value',
		};
		const proxyNodeSpec = wrapNodeSpecProxy(nodeSpec);

		expect(proxyNodeSpec.anotherProperty).toBe('test-value');
	});

	it('should return the original result if toDOM is not a function', () => {
		const nodeSpec = {
			anotherProperty: 'test-value',
		};
		const proxyNodeSpec = wrapNodeSpecProxy(nodeSpec);

		expect(proxyNodeSpec.anotherProperty).toBe('test-value');
	});
});

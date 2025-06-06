import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { validateNodes, validNode } from '../../validateNodes';

function createNode(): PMNode {
	return schema.nodeFromJSON({
		type: 'heading',
		attrs: { level: 2 },
		content: [{ type: 'text', text: 'Nested text' }],
	});
}

afterEach(() => {
	jest.clearAllMocks();
});

function runCommonTests() {
	it('should check content and attributes of valid nodes', () => {
		const validNode = createNode();
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(validNode.type, 'checkContent');
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(validNode.type, 'checkAttrs');

		validateNodes([validNode]);

		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		expect(validNode.type.checkContent).toHaveBeenCalled();
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		expect(validNode.type.checkAttrs).toHaveBeenCalled();
	});

	it('should return true for valid nodes', () => {
		const validNode = createNode();

		expect(validateNodes([validNode])).toBe(true);
	});

	it('should return false for invalid nodes', () => {
		const invalidNode = createNode();
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(invalidNode.type, 'checkAttrs').mockImplementationOnce(() => {
			throw new Error('Invalid attributes');
		});

		expect(validateNodes([invalidNode])).toBe(false);
	});

	it('should return true if all nodes in the array are valid', () => {
		const validNode1 = createNode();
		const validNode2 = createNode();

		expect(validateNodes([validNode1, validNode2])).toBe(true);
	});

	it('should return false if any node in the array is invalid', () => {
		const validNode1 = createNode();
		const validNode2 = createNode();
		const invalidNode = createNode();
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(invalidNode.type, 'checkAttrs').mockImplementationOnce(() => {
			throw new Error('Invalid attributes');
		});

		expect(validateNodes([validNode1, invalidNode, validNode2])).toBe(false);
	});

	it('should validate a single node correctly', () => {
		const validPMNode = createNode();

		expect(validNode(validPMNode)).toBe(true);

		const invalidPMNode = createNode();
		// Mock after checking the valid node, because valid and invalid nodes use the same `type` instance.
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(invalidPMNode.type, 'checkAttrs').mockImplementationOnce(() => {
			throw new Error('Invalid attributes');
		});

		expect(validNode(invalidPMNode)).toBe(false);
	});

	it('should validate child nodes correctly', () => {
		const invalidNode = createNode();
		const nodeType = invalidNode.type;
		const childNodeType = invalidNode.content.content[0].type;

		expect(nodeType).not.toBe(childNodeType);

		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		jest.spyOn(childNodeType, 'checkAttrs').mockImplementationOnce(() => {
			throw new Error('Invalid attributes');
		});

		expect(validateNodes([invalidNode])).toBe(false);
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		expect(childNodeType.checkAttrs).toHaveBeenCalled();
	});
}

eeTest
	.describe('platform_editor_memoized_node_check', 'memoization is NOT enabled')
	.variant(false, () => {
		runCommonTests();

		it('should use check method for valid nodes', () => {
			const validNode = createNode();
			jest.spyOn(validNode, 'check');

			validateNodes([validNode]);

			expect(validNode.check).toHaveBeenCalled();
		});

		it('should use NOT memoized check', () => {
			const validNode = createNode();
			// @ts-expect-error - This is internal ProseMirror API, but we okay with it
			jest.spyOn(validNode.type, 'checkContent');

			validateNodes([validNode]);
			validateNodes([validNode]);
			// @ts-expect-error - This is internal ProseMirror API, but we okay with it
			expect(validNode.type.checkContent).toHaveBeenCalledTimes(2);
		});
	});

eeTest
	.describe('platform_editor_memoized_node_check', 'memoization is enabled')
	.variant(true, () => {
		runCommonTests();

		it('should NOT use check method for valid nodes', () => {
			const validNode = createNode();
			jest.spyOn(validNode, 'check');

			validateNodes([validNode]);

			expect(validNode.check).not.toHaveBeenCalled();
		});

		it('should use memoized check', () => {
			const validNode = createNode();
			// @ts-expect-error - This is internal ProseMirror API, but we okay with it
			jest.spyOn(validNode.type, 'checkContent');

			validateNodes([validNode]);
			validateNodes([validNode]);
			// @ts-expect-error - This is internal ProseMirror API, but we okay with it
			expect(validNode.type.checkContent).toHaveBeenCalledTimes(1);
		});
	});

import { createSchema } from '@atlaskit/adf-schema';
import { syncBlockFallbackTransform } from '../../../transforms/sync-block-fallback-transform';
import type { ADFEntity } from '../../../types';

const syncBlockNode: ADFEntity = {
	type: 'syncBlock',
	attrs: {
		localId: 'sync-1',
		resourceId: 'resource-1',
	},
};

const bodiedSyncBlockWithContent: ADFEntity = {
	type: 'bodiedSyncBlock',
	attrs: {
		localId: 'sync-1',
		resourceId: 'resource-1',
	},
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Bodied sync content' }],
		},
	],
};

const legacyBodiedSyncBlock: ADFEntity = {
	type: 'bodiedSyncBlock',
	attrs: { id: 'sync-2' },
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Content' }] }],
};

const unsupportedBlockWithSyncBlock: ADFEntity = {
	type: 'unsupportedBlock',
	attrs: {
		originalValue: {
			type: 'syncBlock',
			attrs: { id: 'sync-1' },
		},
	},
};

const unsupportedBlockWithoutOriginal: ADFEntity = {
	type: 'unsupportedBlock',
	attrs: {},
};

const paragraphNode: ADFEntity = {
	type: 'paragraph',
	content: [{ type: 'text', text: 'Regular paragraph' }],
};

const textNode: ADFEntity = {
	type: 'text',
	text: 'Simple text node',
};

const emptyDocAdf: ADFEntity = {
	type: 'doc',
	content: [],
};

const docWithSyncBlock: ADFEntity = {
	type: 'doc',
	content: [syncBlockNode],
};

const docWithBodiedSyncBlock: ADFEntity = {
	type: 'doc',
	content: [bodiedSyncBlockWithContent],
};

const docWithBodiedSyncBlockWithContent: ADFEntity = {
	type: 'doc',
	content: [bodiedSyncBlockWithContent],
};

const docWithUnsupportedSyncBlock: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'unsupportedBlock',
			attrs: {
				originalValue: syncBlockNode,
			},
		},
	],
};

const docWithUnsupportedBodiedSyncBlock: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'unsupportedBlock',
			attrs: {
				originalValue: legacyBodiedSyncBlock,
			},
		},
	],
};

const docWithUnsupportedBlockWithSyncBlock: ADFEntity = {
	type: 'doc',
	content: [unsupportedBlockWithSyncBlock],
};

const docWithUnsupportedBlockWithoutOriginal: ADFEntity = {
	type: 'doc',
	content: [unsupportedBlockWithoutOriginal],
};

const docWithMixedContent: ADFEntity = {
	type: 'doc',
	content: [
		paragraphNode,
		{
			type: 'syncBlock',
			attrs: { id: 'sync-1' },
		},
		{
			type: 'bodiedSyncBlock',
			attrs: { id: 'sync-2' },
		},
		{
			type: 'unsupportedBlock',
			attrs: {
				originalValue: {
					type: 'syncBlock',
					attrs: { id: 'sync-3' },
				},
			},
		},
	],
};

const docWithNestedSyncBlock: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'blockquote',
			content: [
				{
					type: 'syncBlock',
					attrs: { id: 'nested-sync' },
				},
			],
		},
	],
};

// Helper to create schemas with different node configurations
const createSchemaWithNodes = (
	options: {
		includeBodiedSyncBlock?: boolean;
		includeSyncBlock?: boolean;
		includeUnsupportedBlock?: boolean;
	} = {},
) => {
	const {
		includeBodiedSyncBlock = false,
		includeSyncBlock = false,
		includeUnsupportedBlock = false,
	} = options;

	const baseNodes = ['doc', 'paragraph', 'text'];
	const nodes = [...baseNodes];

	if (includeSyncBlock) {
		nodes.push('syncBlock');
	}
	if (includeBodiedSyncBlock) {
		nodes.push('bodiedSyncBlock');
	}
	if (includeUnsupportedBlock) {
		nodes.push('unsupportedBlock');
	}

	return createSchema({ nodes });
};

describe('syncBlockFallbackTransform', () => {
	describe('when unsupportedBlock node type is not available', () => {
		it('should return unchanged ADF with isTransformed false', () => {
			const schema = createSchemaWithNodes({ includeSyncBlock: true });

			const result = syncBlockFallbackTransform(schema, docWithSyncBlock);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toBe(docWithSyncBlock);
		});
	});

	describe('when syncBlock is not supported', () => {
		it('should transform syncBlock to unsupportedBlock', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, docWithSyncBlock);

			expect(result.isTransformed).toBe(true);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('unsupportedBlock');
			expect((result.transformedAdf as ADFEntity).content?.[0]?.attrs?.originalValue).toEqual(
				syncBlockNode,
			);
		});

		it('should preserve syncBlock when syncBlock node is available', () => {
			const schema = createSchemaWithNodes({
				includeSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithSyncBlock);

			expect(result.isTransformed).toBe(false);
			expect((result.transformedAdf as ADFEntity).content).toEqual([syncBlockNode]);
		});
	});

	describe('when bodiedSyncBlock is not supported', () => {
		it('should transform bodiedSyncBlock to unsupportedBlock', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, docWithBodiedSyncBlockWithContent);

			expect(result.isTransformed).toBe(true);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('unsupportedBlock');
			expect((result.transformedAdf as ADFEntity).content?.[0]?.attrs?.originalValue).toEqual(
				bodiedSyncBlockWithContent,
			);
		});

		it('should preserve bodiedSyncBlock when bodiedSyncBlock node is available', () => {
			const schema = createSchemaWithNodes({
				includeBodiedSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithBodiedSyncBlock);

			expect(result.isTransformed).toBe(false);
			expect((result.transformedAdf as ADFEntity).content).toEqual([bodiedSyncBlockWithContent]);
		});
	});

	describe('when unsupportedBlock should be converted back', () => {
		it('should convert unsupportedBlock back to syncBlock when syncBlock becomes available', () => {
			const schema = createSchemaWithNodes({
				includeSyncBlock: true,
				includeBodiedSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithUnsupportedSyncBlock);

			expect(result.isTransformed).toBe(true);
			expect((result.transformedAdf as ADFEntity).content).toEqual([syncBlockNode]);
		});

		it('should convert unsupportedBlock back to bodiedSyncBlock when bodiedSyncBlock becomes available', () => {
			const schema = createSchemaWithNodes({
				includeSyncBlock: true,
				includeBodiedSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithUnsupportedBodiedSyncBlock);

			expect(result.isTransformed).toBe(true);
			expect((result.transformedAdf as ADFEntity).content).toEqual([legacyBodiedSyncBlock]);
		});

		it('should preserve unsupportedBlock when corresponding node types are not available', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, docWithUnsupportedBlockWithSyncBlock);

			expect(result.isTransformed).toBe(false);
			expect((result.transformedAdf as ADFEntity).content).toEqual([unsupportedBlockWithSyncBlock]);
		});

		it('should preserve unsupportedBlock without originalValue', () => {
			const schema = createSchemaWithNodes({
				includeSyncBlock: true,
				includeBodiedSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithUnsupportedBlockWithoutOriginal);

			expect(result.isTransformed).toBe(false);
			expect((result.transformedAdf as ADFEntity).content).toEqual([
				unsupportedBlockWithoutOriginal,
			]);
		});
	});

	describe('with mixed content', () => {
		it('should transform only the nodes that need transformation', () => {
			const schema = createSchemaWithNodes({
				includeSyncBlock: true,
				includeUnsupportedBlock: true,
			});

			const result = syncBlockFallbackTransform(schema, docWithMixedContent);

			expect(result.isTransformed).toBe(true);
			const transformedAdf = result.transformedAdf as ADFEntity;
			// Regular paragraph should remain unchanged
			expect(transformedAdf.content?.[0]).toEqual(paragraphNode);
			// syncBlock should remain unchanged (supported)
			expect(transformedAdf.content?.[1]).toEqual(docWithMixedContent.content?.[1]);
			// bodiedSyncBlock should be transformed to unsupportedBlock
			expect(transformedAdf.content?.[2]?.type).toBe('unsupportedBlock');
			// unsupportedBlock should be converted back to syncBlock
			expect(transformedAdf.content?.[3]?.type).toBe('syncBlock');
		});
	});

	describe('with nested content', () => {
		it('should handle transformations in nested structures', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, docWithNestedSyncBlock);

			expect(result.isTransformed).toBe(true);
			const transformedAdf = result.transformedAdf as ADFEntity;
			expect(transformedAdf.content?.[0]?.content?.[0]?.type).toBe('unsupportedBlock');
		});
	});

	describe('edge cases', () => {
		it('should handle empty ADF', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, emptyDocAdf);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toEqual(emptyDocAdf);
		});

		it('should handle ADF without content array', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = syncBlockFallbackTransform(schema, textNode);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toEqual(textNode);
		});
	});
});

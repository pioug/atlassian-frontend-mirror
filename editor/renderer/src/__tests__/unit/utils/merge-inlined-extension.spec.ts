/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
	p as pAdf,
	panel as panelAdf,
	bodiedExtension as bodiedExtensionAdf,
} from '@atlaskit/adf-utils/builders';
import { p, panel, bodiedExtension } from '@atlaskit/editor-test-helpers/doc-builder';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { PanelType } from '@atlaskit/adf-schema';

import { mergeInlinedExtension } from '../../../react/utils/merge-inlined-extension';

const schema = defaultSchema;
const transformer = new JSONTransformer();

// Helper to create a bodied extension node with specific attributes
const createBodiedExtension = (attrs?: Record<string, any>, content?: any) => {
	return bodiedExtension({
		extensionType: 'com.atlassian.test',
		extensionKey: 'test-extension',
		layout: 'default',
		...attrs,
	})(content || p('Extension content'))(schema);
};
const createBodiedExtensionAdf = (attrs?: Record<string, any>, content?: any) => {
	return bodiedExtensionAdf({
		extensionType: 'com.atlassian.test',
		extensionKey: 'test-extension',
		layout: 'default',
		...attrs,
	})(content || pAdf('Extension content'));
};

const alwaysInlineCallback = () => true;
const neverInlineCallback = () => false;

function encodeResult(result: Node[]) {
	return result.map((node) => {
		const docNode = schema.node('doc', null, [node]);
		return transformer.encode(docNode).content[0];
	});
}

describe('basic merging scenarios', () => {
	it('should wrap single inlinedBodiedExtension node in paragraph', () => {
		const extension = createBodiedExtension();
		const nodes = [extension];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// one node: paragraph wrapping the inlinedBodiedExtension
			pAdf(createBodiedExtensionAdf() as any),
		]);
	});

	it('should merge textblock + inlinedBodiedExtension', () => {
		const paragraph = p('Hello')(schema);
		const extension = createBodiedExtension();
		const nodes = [paragraph, extension];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// only one node
			pAdf('Hello', createBodiedExtensionAdf() as any),
		]);
	});

	it('should merge textblock + inlinedBodiedExtension + textblock', () => {
		const paragraph1 = p('Hello')(schema);
		const extension = createBodiedExtension();
		const paragraph2 = p('World')(schema);
		const nodes = [paragraph1, extension, paragraph2];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// only one node
			pAdf('Hello', createBodiedExtensionAdf() as any, 'World'),
		]);
	});

	it('should merge inlinedBodiedExtension + textblock', () => {
		const extension = createBodiedExtension();
		const paragraph = p('World')(schema);
		const nodes = [extension, paragraph];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// only one node
			pAdf(createBodiedExtensionAdf() as any, 'World'),
		]);
	});

	it('should wrap inlinedBodiedExtension in paragraph when followed by non-textblock', () => {
		const extension = createBodiedExtension();
		// Create a non-textblock node
		const nonTextblock = panel({ panelType: 'info' })(p('This is a info panel'))(schema);
		const nodes = [extension, nonTextblock];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: (params) => params.extensionKey === 'test-extension',
		});

		expect(encodeResult(result)).toEqual([
			// two nodes
			pAdf(createBodiedExtensionAdf() as any),
			panelAdf({ panelType: PanelType.INFO })(pAdf('This is a info panel')),
		]);
	});

	it('should merge multiple consecutive inlinedBodiedExtensions with textblocks', () => {
		const p1 = p('Start')(schema);
		const ext1 = createBodiedExtension({ extensionKey: 'ext1' });
		const p2 = p('Middle')(schema);
		const ext2 = createBodiedExtension({ extensionKey: 'ext2' });
		const p3 = p('End')(schema);
		const nodes = [p1, ext1, p2, ext2, p3];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// one node
			pAdf(
				'Start',
				createBodiedExtensionAdf({ extensionKey: 'ext1' }) as any,
				'Middle',
				createBodiedExtensionAdf({ extensionKey: 'ext2' }) as any,
				'End',
			),
		]);
	});

	it('should not merge inlinedBodiedExtension with non-textblock nodes', () => {
		const extension1 = createBodiedExtension({ extensionKey: 'ext1' });
		const extension2 = createBodiedExtension({ extensionKey: 'ext2' });
		const nodes = [extension1, extension2];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: (params) => params.extensionKey === 'ext1',
		});

		expect(encodeResult(result)).toEqual([
			// two nodes
			pAdf(createBodiedExtensionAdf({ extensionKey: 'ext1' }) as any),
			createBodiedExtensionAdf({ extensionKey: 'ext2' }),
		]);
	});
});

describe('callback filtering', () => {
	it('should not merge when callback returns false', () => {
		const paragraph1 = p('Hello')(schema);
		const extension = createBodiedExtension();
		const paragraph2 = p('World')(schema);
		const nodes = [paragraph1, extension, paragraph2];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: neverInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			pAdf('Hello'),
			createBodiedExtensionAdf(),
			pAdf('World'),
		]);
	});

	it('should call callback with correct extension params', () => {
		const mockCallback = jest.fn(() => true);
		const extensionAttrs = {
			extensionType: 'com.atlassian.custom',
			extensionKey: 'custom-key',
			parameters: { foo: 'bar' },
			localId: 'test-local-id',
		};
		const extension = createBodiedExtension(extensionAttrs);
		const paragraph = p('Text')(schema);
		const nodes = [paragraph, extension];

		mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: mockCallback,
		});

		expect(mockCallback).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'bodiedExtension',
				extensionKey: extensionAttrs.extensionKey,
				extensionType: extensionAttrs.extensionType,
				parameters: extensionAttrs.parameters,
				localId: extensionAttrs.localId,
			}),
		);
	});

	it('should filter inlinedBodiedExtensions based on callback and only merge filtered ones', () => {
		const p1 = p('Start')(schema);
		const targetExt = createBodiedExtension({
			extensionType: 'com.atlassian.target',
			extensionKey: 'target-key',
		});
		const otherExt = createBodiedExtension({
			extensionType: 'com.atlassian.other',
			extensionKey: 'other-key',
		});
		const p2 = p('End')(schema);
		const nodes = [p1, targetExt, otherExt, p2];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: (params) => params.extensionType === 'com.atlassian.target',
		});

		expect(encodeResult(result)).toEqual([
			pAdf(
				'Start',
				createBodiedExtensionAdf({
					extensionType: 'com.atlassian.target',
					extensionKey: 'target-key',
				}) as any,
			),
			createBodiedExtensionAdf({
				extensionType: 'com.atlassian.other',
				extensionKey: 'other-key',
			}),
			pAdf('End'),
		]);
	});
});

describe('edge cases', () => {
	it('should return empty array when given empty array', () => {
		const result = mergeInlinedExtension({
			nodes: [],
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(result).toEqual([]);
	});

	it('should return single node unchanged', () => {
		const paragraph = p('Hello')(schema);
		const nodes = [paragraph];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([pAdf('Hello')]);
	});

	it('should handle multiple consecutive textblocks without inlinedBodiedExtensions', () => {
		const p1 = p('First')(schema);
		const p2 = p('Second')(schema);
		const p3 = p('Third')(schema);
		const nodes = [p1, p2, p3];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// same nodes
			pAdf('First'),
			pAdf('Second'),
			pAdf('Third'),
		]);
	});

	it('should handle nodes with complex content', () => {
		const complexParagraph = p('Hello ', 'bold', ' world')(schema);
		const extension = createBodiedExtension();
		const nodes = [complexParagraph, extension];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			// one node
			pAdf('Hello bold world', createBodiedExtensionAdf() as any),
		]);
	});

	it('should handle textblock with existing extension at end + new textblock', () => {
		const ext1 = createBodiedExtension({ extensionKey: 'ext1' });
		const p1 = p('Text1')(schema);
		const nodes1 = [p1, ext1];

		// First merge to get paragraph with extension at end
		const merged = mergeInlinedExtension({
			nodes: nodes1,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(merged.length).toBe(1);
		const paragraphWithExt = merged[0];

		// Now test merging another textblock after
		const p2 = p('Text2')(schema);
		const nodes2 = [paragraphWithExt, p2];

		const result = mergeInlinedExtension({
			nodes: nodes2,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			pAdf('Text1', createBodiedExtensionAdf({ extensionKey: 'ext1' }) as any, 'Text2'),
		]);
	});
});

describe('error handling', () => {
	it('should return original nodes if an error occurs during processing', () => {
		const paragraph = p('Hello')(schema);
		const extension = createBodiedExtension();
		const nodes = [paragraph, extension];

		// Mock a scenario where copy() throws an error
		const mockCallback = jest.fn(() => {
			throw new Error('Test error');
		});

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: mockCallback,
		});

		expect(mockCallback).toHaveBeenCalled();
		// Should return original nodes on error
		expect(result).toBe(nodes);
	});
});

describe('content preservation', () => {
	it('should preserve extension content during merge', () => {
		const extensionContent = 'Extension inner content';
		const extension = createBodiedExtension({}, p(extensionContent));
		const paragraph = p('Outer text')(schema);
		const nodes = [paragraph, extension];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			pAdf('Outer text', createBodiedExtensionAdf({}, pAdf(extensionContent)) as any),
		]);
	});

	it('should preserve node attributes during merge', () => {
		const extensionAttrs = {
			extensionType: 'com.atlassian.test',
			extensionKey: 'test-key',
			parameters: { setting: 'value' },
			localId: 'unique-id',
		};
		const extension = createBodiedExtension(extensionAttrs);
		const paragraph = p('Text')(schema);
		const nodes = [paragraph, extension];

		const result = mergeInlinedExtension({
			nodes,
			shouldDisplayExtensionAsInline: alwaysInlineCallback,
		});

		expect(encodeResult(result)).toEqual([
			pAdf(
				'Text',
				createBodiedExtensionAdf({
					extensionType: extensionAttrs.extensionType,
					extensionKey: extensionAttrs.extensionKey,
					parameters: extensionAttrs.parameters,
					localId: extensionAttrs.localId,
				}) as any,
			),
		]);
	});
});

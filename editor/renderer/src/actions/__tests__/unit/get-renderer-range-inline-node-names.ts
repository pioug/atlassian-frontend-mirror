import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getRendererRangeInlineNodeNames } from '../../get-renderer-range-inline-node-names';
import RendererActions from '../../index';

describe('getRendererRangeInlineNodeNames', () => {
	describe.each([
		[
			'should return undefined if document position is false',
			{ doc: doc(p(''))(defaultSchema) as unknown as PMNode } as unknown as RendererActions,
			false as const,
		],
		[
			'should return undefined if there is no doc on renderer actions',
			{} as RendererActions,
			{ from: 1, to: 10 },
		],
	])(`%s`, (_, actions, pos) => {
		it('when feature gate editor_inline_comments_on_inline_nodes is ON, returns undefined', () => {
			passGate('editor_inline_comments_on_inline_nodes');
			expect(getRendererRangeInlineNodeNames({ actions, pos })).toEqual(undefined);
		});

		it('when feature gate editor_inline_comments_on_inline_nodes is OFF, returns undefined', () => {
			failGate('editor_inline_comments_on_inline_nodes');
			expect(getRendererRangeInlineNodeNames({ actions, pos })).toEqual(undefined);
		});
	});
});

describe('applyAnnotation', () => {
	it('applies an annotation without collecting ancestor node types', () => {
		const actions = new RendererActions(true);
		actions._privateRegisterRenderer(
			{ current: null },
			doc(p('Some text'))(defaultSchema),
			defaultSchema,
		);
		const result = actions.applyAnnotation(
			{ from: 1, to: 5 },
			{ annotationId: 'annotation-id', annotationType: AnnotationTypes.INLINE_COMMENT },
		);

		expect(result).toBeTruthy();
		if (!result) {
			throw new Error('Expected annotation to be applied');
		}
		expect(result).not.toHaveProperty('ancestorNodeTypes');
		expect(result.originalSelection).toBe('Some');
	});
});

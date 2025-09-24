import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	getRendererRangeInlineNodeNames,
	getRendererRangeAncestorNodeNames,
} from '../../get-renderer-range-inline-node-names';

import type RendererActions from '../../index';

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
		ffTest(
			'editor_inline_comments_on_inline_nodes',
			() => {
				expect(getRendererRangeInlineNodeNames({ actions, pos })).toEqual(undefined);
			},
			() => {
				expect(getRendererRangeInlineNodeNames({ actions, pos })).toEqual(undefined);
			},
		);
	});
});

describe('getRendererRangeAncestorNodeNames', () => {
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
		ffTest(
			'cc_comments_log_draft_annotation_ancestor_nodes',
			() => {
				expect(getRendererRangeAncestorNodeNames({ actions, pos })).toEqual(undefined);
			},
			() => {
				expect(getRendererRangeAncestorNodeNames({ actions, pos })).toEqual(undefined);
			},
		);
	});
});

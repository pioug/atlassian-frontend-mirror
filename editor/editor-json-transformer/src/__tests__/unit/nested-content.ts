import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, expand, nestedExpand, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { JSONTransformer } from '../../index';
import type { JSONDocNode } from '../../index';

describe('JSONTransformer - Nested content', () => {
	const createEditor = createEditorFactory();
	const transformer = new JSONTransformer();

	describe('encode', () => {
		const toJSON = (node: PMNode) => transformer.encode(node);

		it('should encode a document with nestedExpand nested in expand', () => {
			const document = doc(
				expand({
					title: 'Parent expand title',
					__expanded: true,
				})(
					nestedExpand({
						title: 'Nested expand title',
						__expanded: true,
					})(p('Nested expand content')),
				),
			);
			const { editorView } = createEditor({
				doc: document,
				editorProps: {
					allowExpand: true,
					featureFlags: {
						'nested-expand-in-expand-ex': true,
					},
				},
			});

			expect(toJSON(editorView.state.doc)).toEqual({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'expand',
						attrs: {
							title: 'Parent expand title',
						},
						content: [
							{
								type: 'nestedExpand',
								attrs: {
									title: 'Nested expand title',
								},
								content: [
									{
										type: 'paragraph',
										content: [
											{
												type: 'text',
												text: 'Nested expand content',
											},
										],
									},
								],
							},
						],
					},
				],
			});
		});
	});

	describe('parse', () => {
		const parseJSON = (node: JSONDocNode) => transformer.parse(node);

		it('should parse a document with nestedExpand nested in expand', () => {
			const adf: JSONDocNode = {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'expand',
						attrs: {
							title: 'Parent expand title',
						},
						content: [
							{
								type: 'nestedExpand',
								attrs: {
									title: 'Nested expand title',
								},
								content: [
									{
										type: 'paragraph',
										content: [
											{
												type: 'text',
												text: 'Nested expand content',
											},
										],
									},
								],
							},
						],
					},
				],
			};

			expect(parseJSON(adf)).toEqualDocument(
				doc(
					expand({
						title: 'Parent expand title',
						__expanded: true,
					})(
						nestedExpand({
							title: 'Nested expand title',
							__expanded: true,
						})(p('Nested expand content')),
					),
				),
			);
		});
	});
});

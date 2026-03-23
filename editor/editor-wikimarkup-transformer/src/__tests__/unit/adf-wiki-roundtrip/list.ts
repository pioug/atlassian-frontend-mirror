import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import WikiMarkupTransformer from '../../../index';

import {
	doc,
	li,
	ol,
	p,
	ul,
	hardBreak,
	taskList,
	taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - List', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert bulletList node', () => {
		const node = doc(ul(li(p('item 1')), li(p('item 2'))))(defaultSchema);
		const wiki = transformer.encode(node);
		const adf = transformer.parse(wiki).toJSON();
		expect(adf).toEqual(node.toJSON());
	});

	test('should convert listItem with multiple paragraph', () => {
		const node = doc(ul(li(p('item 1A'), p('item 1B')), li(p('item 2'))))(defaultSchema);
		const wiki = transformer.encode(node);
		const adf = transformer.parse(wiki).toJSON();
		const expectedNode = doc(ul(li(p('item 1A', hardBreak(), 'item 1B')), li(p('item 2'))))(
			defaultSchema,
		);
		expect(adf).toEqual(expectedNode.toJSON());
	});

	test('should convert orderedList node', () => {
		const node = doc(ol()(li(p('item 1')), li(p('item 2'))))(defaultSchema);
		const wiki = transformer.encode(node);
		const adf = transformer.parse(wiki).toJSON();
		expect(adf).toEqual(node.toJSON());
	});

	test('should convert nested orderedList inside bulletList', () => {
		const node = doc(
			ul(li(p('item 1'), ol()(li(p('innner item 1')), li(p('innner item 2')))), li(p('item 2'))),
		)(defaultSchema);
		const wiki = transformer.encode(node);
		const adf = transformer.parse(wiki).toJSON();
		expect(adf).toEqual(node.toJSON());
	});

	test('should convert nested bulletList inside orderedList', () => {
		const node = doc(
			ol()(li(p('item 1'), ul(li(p('innner item 1')), li(p('innner item 2')))), li(p('item 2'))),
		)(defaultSchema);
		const wiki = transformer.encode(node);
		const adf = transformer.parse(wiki).toJSON();
		expect(adf).toEqual(node.toJSON());
	});

	describe('flexible list indentation (wrapper listItem)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const stage0Transformer = new WikiMarkupTransformer(stage0Schema);

		/**
		 * Helper to create a PMNode from raw ADF JSON using stage0 schema.
		 */
		function fromADF(adfDoc: Record<string, unknown>): PMNode {
			return PMNode.fromJSON(stage0Schema, adfDoc);
		}

		/**
		 * Helper to create a text paragraph ADF node.
		 */
		function textPara(text: string) {
			return {
				type: 'paragraph',
				content: [{ type: 'text', text }],
			};
		}

		/**
		 * Helper to create a wrapper listItem (list as first child, no paragraph).
		 */
		function wrapperLi(...content: Record<string, unknown>[]) {
			return { type: 'listItem', content };
		}

		/**
		 * Helper to create a normal listItem with a text paragraph.
		 */
		function textLi(text: string) {
			return { type: 'listItem', content: [textPara(text)] };
		}

		function bList(...items: Record<string, unknown>[]) {
			return { type: 'bulletList', content: items };
		}

		function oList(...items: Record<string, unknown>[]) {
			return { type: 'orderedList', attrs: { order: 1 }, content: items };
		}

		test('should encode multi-level step up and down (bullet: 1 → 3 → 5 → 5 → 3 → 1)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					bList(
						textLi('Level 1 item'),
						wrapperLi(
							bList(
								wrapperLi(
									bList(
										textLi('Level 3 item (stepped down from 1)'),
										wrapperLi(
											bList(
												wrapperLi(
													bList(
														textLi('Level 5 item A (stepped down from 3)'),
														textLi('Level 5 item B'),
													),
												),
											),
										),
										textLi('Level 3 item (stepped up from 5)'),
									),
								),
							),
						),
						textLi('Level 1 item (stepped up from 3)'),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'* Level 1 item',
					'*** Level 3 item (stepped down from 1)',
					'***** Level 5 item A (stepped down from 3)',
					'***** Level 5 item B',
					'*** Level 3 item (stepped up from 5)',
					'* Level 1 item (stepped up from 3)',
				].join('\n'),
			);

			// Wiki markup can't distinguish wrapper listItems from merged listItems,
			// so the parser merges the nested list into the preceding listItem.
			// Verify stability via double roundtrip: ADF → wiki → ADF → wiki
			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode all items at max depth 6 (bullet: 5 wrapper layers)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					bList(
						wrapperLi(
							bList(
								wrapperLi(
									bList(
										wrapperLi(
											bList(
												wrapperLi(
													bList(
														wrapperLi(
															bList(
																textLi('Max depth 6 - first item'),
																textLi('Max depth 6 - second item'),
																textLi('Max depth 6 - third item'),
															),
														),
													),
												),
											),
										),
									),
								),
							),
						),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'****** Max depth 6 - first item',
					'****** Max depth 6 - second item',
					'****** Max depth 6 - third item',
				].join('\n'),
			);

			const parsed = stage0Transformer.parse(wiki);
			expect(parsed.toJSON()).toEqual(node.toJSON());
		});

		test('should encode alternating depths (bullet: 4 → 1 → 5 → 2 → 6 → 3)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					bList(
						wrapperLi(
							bList(
								wrapperLi(
									bList(
										wrapperLi(
											bList(textLi('Item 1 at level 4')),
										),
									),
								),
							),
						),
						textLi('Item 2 at level 1'),
						wrapperLi(
							bList(
								wrapperLi(
									bList(
										wrapperLi(
											bList(
												wrapperLi(
													bList(textLi('Item 3 at level 5')),
												),
											),
										),
										textLi('Item 4 at level 2'),
										wrapperLi(
											bList(
												wrapperLi(
													bList(
														wrapperLi(
															bList(
																wrapperLi(
																	bList(textLi('Item 5 at level 6')),
																),
															),
														),
													),
												),
												textLi('Item 6 at level 3'),
											),
										),
									),
								),
							),
						),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'**** Item 1 at level 4',
					'* Item 2 at level 1',
					'***** Item 3 at level 5',
					'*** Item 4 at level 2',
					'******* Item 5 at level 6',
					'**** Item 6 at level 3',
				].join('\n'),
			);

			// Verify stability via double roundtrip: ADF → wiki → ADF → wiki
			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode multi-level step up and down (ordered: 1 → 3 → 5 → 5 → 3 → 1)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					oList(
						textLi('Level 1 item'),
						wrapperLi(
							oList(
								wrapperLi(
									oList(
										textLi('Level 3 item (stepped down from 1)'),
										wrapperLi(
											oList(
												wrapperLi(
													oList(
														textLi('Level 5 item A (stepped down from 3)'),
														textLi('Level 5 item B'),
													),
												),
											),
										),
										textLi('Level 3 item (stepped up from 5)'),
									),
								),
							),
						),
						textLi('Level 1 item (stepped up from 3)'),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'# Level 1 item',
					'### Level 3 item (stepped down from 1)',
					'##### Level 5 item A (stepped down from 3)',
					'##### Level 5 item B',
					'### Level 3 item (stepped up from 5)',
					'# Level 1 item (stepped up from 3)',
				].join('\n'),
			);

			// Verify stability via double roundtrip: ADF → wiki → ADF → wiki
			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode all items at max depth 6 (ordered: 5 wrapper layers)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					oList(
						wrapperLi(
							oList(
								wrapperLi(
									oList(
										wrapperLi(
											oList(
												wrapperLi(
													oList(
														wrapperLi(
															oList(
																textLi('Max depth 6 - first item'),
																textLi('Max depth 6 - second item'),
																textLi('Max depth 6 - third item'),
															),
														),
													),
												),
											),
										),
									),
								),
							),
						),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'###### Max depth 6 - first item',
					'###### Max depth 6 - second item',
					'###### Max depth 6 - third item',
				].join('\n'),
			);

			const parsed = stage0Transformer.parse(wiki);
			expect(parsed.toJSON()).toEqual(node.toJSON());
		});

		test('should encode alternating depths (ordered: 4 → 1 → 5 → 2 → 6 → 3)', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					oList(
						wrapperLi(
							oList(
								wrapperLi(
									oList(
										wrapperLi(
											oList(textLi('Item 1 at level 4')),
										),
									),
								),
							),
						),
						textLi('Item 2 at level 1'),
						wrapperLi(
							oList(
								wrapperLi(
									oList(
										wrapperLi(
											oList(
												wrapperLi(
													oList(textLi('Item 3 at level 5')),
												),
											),
										),
										textLi('Item 4 at level 2'),
										wrapperLi(
											oList(
												wrapperLi(
													oList(
														wrapperLi(
															oList(
																wrapperLi(
																	oList(textLi('Item 5 at level 6')),
																),
															),
														),
													),
												),
												textLi('Item 6 at level 3'),
											),
										),
									),
								),
							),
						),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'#### Item 1 at level 4',
					'# Item 2 at level 1',
					'##### Item 3 at level 5',
					'### Item 4 at level 2',
					'####### Item 5 at level 6',
					'#### Item 6 at level 3',
				].join('\n'),
			);

			// Verify stability via double roundtrip: ADF → wiki → ADF → wiki
			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode task list step up and down (task: 1 → 3 → 1) with double roundtrip', () => {
			const node = doc(
				taskList({ localId: 'tl-1' })(
					taskItem({ localId: 'ti-1', state: 'TODO' })('Level 1 item'),
					taskList({ localId: 'tl-2' })(
						taskList({ localId: 'tl-3' })(
							taskItem({ localId: 'ti-2', state: 'DONE' })('Level 3 item'),
						),
					),
					taskItem({ localId: 'ti-3', state: 'TODO' })('Back to level 1'),
				),
			)(stage0Schema);

			const wiki = stage0Transformer.encode(node);

			expect(wiki).toBe(
				['* Level 1 item', '*** -Level 3 item-', '* Back to level 1'].join('\n'),
			);

			// Double roundtrip: ADF → wiki → ADF → wiki
			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode task list at max depth 4 with roundtrip stability', () => {
			const node = doc(
				taskList({ localId: 'tl-1' })(
					taskList({ localId: 'tl-2' })(
						taskList({ localId: 'tl-3' })(
							taskList({ localId: 'tl-4' })(
								taskItem({ localId: 'ti-1', state: 'TODO' })('Deep first'),
								taskItem({ localId: 'ti-2', state: 'DONE' })('Deep second'),
							),
						),
					),
				),
			)(stage0Schema);

			const wiki = stage0Transformer.encode(node);

			expect(wiki).toBe(
				['**** Deep first', '**** -Deep second-'].join('\n'),
			);

			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode alternating task list depths (3 → 1 → 3 → 1) with double roundtrip', () => {
			const node = doc(
				taskList({ localId: 'tl-1' })(
					taskList({ localId: 'tl-2' })(
						taskList({ localId: 'tl-3' })(
							taskItem({ localId: 'ti-1', state: 'TODO' })('At level 3'),
						),
					),
					taskItem({ localId: 'ti-2', state: 'DONE' })('At level 1'),
					taskList({ localId: 'tl-4' })(
						taskList({ localId: 'tl-5' })(
							taskItem({ localId: 'ti-3', state: 'DONE' })('At level 3 again'),
						),
					),
					taskItem({ localId: 'ti-4', state: 'TODO' })('At level 1 again'),
				),
			)(stage0Schema);

			const wiki = stage0Transformer.encode(node);

			expect(wiki).toBe(
				[
					'*** At level 3',
					'* -At level 1-',
					'*** -At level 3 again-',
					'* At level 1 again',
				].join('\n'),
			);

			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});

		test('should encode taskList inside listItem wrapper (bullet > task) with double roundtrip', () => {
			const adfDoc = {
				version: 1,
				type: 'doc',
				content: [
					bList(
						textLi('Bullet item'),
						wrapperLi({
							type: 'taskList',
							attrs: { localId: 'tl-in-bullet' },
							content: [
								{
									type: 'taskItem',
									attrs: { localId: 'ti-1', state: 'TODO' },
									content: [{ type: 'text', text: 'Task inside bullet' }],
								},
								{
									type: 'taskItem',
									attrs: { localId: 'ti-2', state: 'DONE' },
									content: [{ type: 'text', text: 'Done task inside bullet' }],
								},
							],
						}),
						textLi('Another bullet'),
					),
				],
			};

			const node = fromADF(adfDoc);
			const wiki = transformer.encode(node);

			expect(wiki).toBe(
				[
					'* Bullet item',
					'** Task inside bullet',
					'** -Done task inside bullet-',
					'* Another bullet',
				].join('\n'),
			);

			const parsed = stage0Transformer.parse(wiki);
			const reEncoded = stage0Transformer.encode(parsed);
			expect(reEncoded).toBe(wiki);
		});
	});
});

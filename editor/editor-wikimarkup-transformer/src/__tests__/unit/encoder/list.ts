import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import {
	doc,
	li,
	ol,
	p,
	ul,
	code_block,
	media,
	mediaSingle,
	taskList,
	taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - List', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert bulletList node', () => {
		const node = doc(ul(li(p('item 1')), li(p('item 2'))))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert listItem with multiple paragraph', () => {
		const node = doc(ul(li(p('item 1A'), p('item 1B')), li(p('item 2'))))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert orderedList node', () => {
		const node = doc(ol()(li(p('item 1')), li(p('item 2'))))(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert nested orderedList inside bulletList', () => {
		const node = doc(
			ul(li(p('item 1'), ol()(li(p('innner item 1')), li(p('innner item 2')))), li(p('item 2'))),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert nested bulletList inside orderedList', () => {
		const node = doc(
			ol()(li(p('item 1'), ul(li(p('innner item 1')), li(p('innner item 2')))), li(p('item 2'))),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert codeblock node', () => {
		const node = doc(
			ul(li(p('item 1')), li(p('item 2'), code_block({ language: 'javascript' })('const i = 0;'))),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert mediaSingle node', () => {
		const node = doc(
			ul(
				li(p('item 1')),
				li(
					p('item 2'),
					mediaSingle()(
						media({
							id: 'abc-123',
							type: 'file',
							collection: 'tmp',
							width: 100,
							height: 100,
						})(),
					),
				),
			),
		)(defaultSchema);
		expect(
			transformer.encode(node, {
				conversion: {
					mediaConversion: {
						'abc-123': { transform: 'file1.txt', embed: true },
					},
				},
			}),
		).toMatchSnapshot();
	});

	describe('flexible list indentation (wrapper listItem)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');

		test('should convert wrapper listItem with nested orderedList as first child in bulletList', () => {
			const node = doc(
				ul(li(p('item 1')), li(ol()(li(p('nested item 1')), li(p('nested item 2'))))),
			)(stage0Schema);
			expect(transformer.encode(node)).toMatchSnapshot();
		});

		test('should convert wrapper listItem with nested bulletList as first child in orderedList', () => {
			const node = doc(
				ol()(li(p('item 1')), li(ul(li(p('nested item 1')), li(p('nested item 2'))))),
			)(stage0Schema);
			expect(transformer.encode(node)).toMatchSnapshot();
		});

		test('should convert wrapper listItem with nested bulletList as first child in bulletList', () => {
			const node = doc(ul(li(p('item 1')), li(ul(li(p('nested item 1')), li(p('nested item 2'))))))(
				stage0Schema,
			);
			expect(transformer.encode(node)).toMatchSnapshot();
		});

		test('should convert wrapper listItem with taskList as child of bulletList', () => {
			const node = doc(
				ul(
					li(p('item 1')),
					li(
						p('item 2'),
						taskList({ localId: 'task-list-1' })(
							taskItem({ localId: 'task-1', state: 'TODO' })('task one'),
							taskItem({ localId: 'task-2', state: 'DONE' })('task two'),
						),
					),
				),
			)(stage0Schema);
			expect(transformer.encode(node)).toMatchSnapshot();
		});

		test('should convert deeply nested wrapper listItems', () => {
			const node = doc(ul(li(ol()(li(ul(li(p('deep item'))))))))(stage0Schema);
			expect(transformer.encode(node)).toMatchSnapshot();
		});
	});
});

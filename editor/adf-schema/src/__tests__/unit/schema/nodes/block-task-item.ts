import type { SchemaConfig } from '../../../../schema/create-schema';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { blockTaskItem } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema blockTaskItem node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(blockTaskItem).toEqual({
			attrs: {
				localId: {
					default: '',
				},
				state: {
					default: 'TODO',
				},
			},
			content: '(paragraph | extension) (paragraph | extension)*',
			defining: true,
			marks: 'fontSize unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'div[data-task-is-block]',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <div> with proper data-attributes', () => {
		const html = toHTML(schema.nodes.blockTaskItem.create(), schema);
		expect(html).toContain('<div');
		expect(html).toContain('data-task-local-id');
		expect(html).toContain('data-task-state');
		expect(html).toContain('data-task-is-block');
	});

	it('matches <div data-task-local-id>', () => {
		const doc = fromHTML('<div data-task-is-block>', schema);
		const blockTaskItem = doc.firstChild!.firstChild!;
		expect(blockTaskItem.type.name).toEqual('blockTaskItem');
	});

	it('blockTaskItem requires defining to be true', () => {
		expect(schema.nodes.blockTaskItem.spec.defining).toBe(true);
	});

	describe('fontSize mark support', () => {
		const schemaWithFontSize = makeSchemaWithFontSize();

		it('paragraph with fontSize is valid inside blockTaskItem', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small task text')],
				[fontSizeMark],
			);
			const taskItem = schemaWithFontSize.nodes.blockTaskItem.create(
				{ localId: 'test-id', state: 'TODO' },
				[paragraph],
			);

			expect(taskItem.type.name).toBe('blockTaskItem');
			expect(taskItem.firstChild!.type.name).toBe('paragraph');
			expect(taskItem.firstChild!.marks).toHaveLength(1);
			expect(taskItem.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(taskItem.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('blockTaskItem can contain paragraphs with and without fontSize', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const smallParagraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text')],
				[fontSizeMark],
			);
			const normalParagraph = schemaWithFontSize.nodes.paragraph.create({}, [
				schemaWithFontSize.text('Normal text'),
			]);
			const taskItem = schemaWithFontSize.nodes.blockTaskItem.create(
				{ localId: 'test-id', state: 'TODO' },
				[smallParagraph, normalParagraph],
			);

			expect(taskItem.childCount).toBe(2);
			expect(taskItem.firstChild!.marks).toHaveLength(1);
			expect(taskItem.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(taskItem.lastChild!.marks).toHaveLength(0);
		});

		it('blockTaskItem with fontSize paragraph serializes correctly', () => {
			const fontSizeMark = schemaWithFontSize.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schemaWithFontSize.nodes.paragraph.create(
				{},
				[schemaWithFontSize.text('Small text')],
				[fontSizeMark],
			);
			const taskItem = schemaWithFontSize.nodes.blockTaskItem.create(
				{ localId: 'test-id', state: 'TODO' },
				[paragraph],
			);

			const html = toHTML(taskItem, schemaWithFontSize);
			expect(html).toContain('data-font-size="small"');
			expect(html).toContain('data-task-is-block');
		});
	});
});

function makeSchema() {
	const defaultSchemaConfig = {
		nodes: [
			'doc',
			'paragraph',
			'text',
			'taskList',
			'taskItem',
			'blockTaskItem',
			'orderedList',
			'bulletList',
			'listItem',
		],
		marks: ['unsupportedMark', 'unsupportedNodeAttribute', 'indentation', 'alignment'],
	} as SchemaConfig;
	return createSchema(defaultSchemaConfig);
}

function makeSchemaWithFontSize() {
	return createSchema({
		nodes: [
			'doc',
			'paragraph',
			'text',
			'taskList',
			'taskItem',
			'blockTaskItem',
			'orderedList',
			'bulletList',
			'listItem',
		],
		marks: ['fontSize', 'unsupportedMark', 'unsupportedNodeAttribute'],
	} as SchemaConfig);
}

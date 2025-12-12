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
			marks: 'dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
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

import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { taskItem } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema taskItem node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(taskItem).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
				state: {
					default: 'TODO',
				},
			},
			content: 'inline*',
			defining: true,
			marks: '_',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'div[data-task-local-id]',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <div> with proper data-attributes', () => {
		const html = toHTML(schema.nodes.taskItem.create(), schema);
		expect(html).toContain('<div');
		expect(html).toContain('data-task-local-id');
		expect(html).toContain('data-task-state');
	});

	it('matches <div data-task-local-id>', () => {
		const doc = fromHTML('<div data-task-local-id>', schema);
		const taskItem = doc.firstChild!.firstChild!;
		expect(taskItem.type.name).toEqual('taskItem');
	});

	it('taskItem requires defining to be true', () => {
		expect(schema.nodes.taskItem.spec.defining).toBe(true);
	});
});

function makeSchema() {
	return createSchema({
		nodes: [
			'doc',
			'paragraph',
			'text',
			'taskList',
			'taskItem',
			'orderedList',
			'bulletList',
			'listItem',
		],
	});
}

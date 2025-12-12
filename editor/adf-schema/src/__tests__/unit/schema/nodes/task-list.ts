import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { taskList } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema taskList node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(taskList).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
			},
			content:
				'(taskItem | unsupportedBlock | blockTaskItem)+ (taskItem | taskList | unsupportedBlock | blockTaskItem)*',
			defining: true,
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'div[data-node-type="actionList"]',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <div> with proper data-attributes', () => {
		const html = toHTML(schema.nodes.taskList.create({ localId: 'cheese' }), schema);
		expect(html).toContain('<div');
		expect(html).toContain('data-task-list-local-id="cheese"');
	});

	it('matches <div data-task-list-local-id>', () => {
		const doc = fromHTML('<div data-node-type="actionList" data-task-list-local-id>', schema);
		const taskList = doc.firstChild!;
		expect(taskList.type.name).toEqual('taskList');
		expect(taskList.attrs.localId).not.toEqual(undefined);
	});

	it('taskList requires defining to be true', () => {
		expect(schema.nodes.taskList.spec.defining).toBe(true);
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

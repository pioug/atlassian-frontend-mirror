import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { decisionItem } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema decisionItem node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(decisionItem).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
				state: {
					default: 'DECIDED',
				},
			},
			content: 'inline*',
			defining: true,
			marks: '_',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'li[data-decision-local-id]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to <li> with proper data-attributes', () => {
		const html = toHTML(schema.nodes.decisionItem.create(), schema);
		expect(html).toContain('<li');
		expect(html).toContain('data-decision-local-id');
		expect(html).toContain('data-decision-state');
	});

	it('matches <li data-decision-local-id>', () => {
		const doc = fromHTML('<li  data-decision-local-id>', schema);
		const decisionItem = doc.firstChild!.firstChild!;
		expect(decisionItem.type.name).toEqual('decisionItem');
	});

	it('does not match <li>', () => {
		const doc = fromHTML('<li>', schema);
		const listItem = doc.firstChild!.firstChild!;
		expect(listItem.type.name).toEqual('listItem');
	});

	it('decisionItem requires defining to be true', () => {
		expect(schema.nodes.decisionItem.spec.defining).toBe(true);
	});
});

function makeSchema() {
	return createSchema({
		nodes: [
			'doc',
			'paragraph',
			'heading',
			'text',
			'decisionList',
			'decisionItem',
			'orderedList',
			'bulletList',
			'listItem',
		],
	});
}

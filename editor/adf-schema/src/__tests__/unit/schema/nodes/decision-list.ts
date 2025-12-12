import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { decisionList } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema decisionList node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(decisionList).toStrictEqual({
			attrs: {
				localId: {
					default: '',
				},
			},
			content: '(decisionItem | unsupportedBlock)+',
			defining: true,
			group: 'block',
			marks: 'unsupportedMark unsupportedNodeAttribute',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					priority: 100,
					tag: 'ol[data-node-type="decisionList"]',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <ol> with proper data-attributes', () => {
		const html = toHTML(schema.nodes.decisionList.create({ localId: 'cheese' }), schema);
		expect(html).toContain('<ol');
		expect(html).toContain('data-decision-list-local-id="cheese"');
	});

	it('matches <ol data-decision-list-local-id>', () => {
		const doc = fromHTML('<ol data-node-type="decisionList" data-decision-list-local-id>', schema);
		const decisionList = doc.firstChild!;
		expect(decisionList.type.name).toEqual('decisionList');
		expect(decisionList.attrs.localId).not.toEqual(undefined);
	});

	it('does not match <ol>', () => {
		const doc = fromHTML('<ol>', schema);
		const orderedList = doc.firstChild!;
		expect(orderedList.type.name).toEqual('orderedList');
	});

	it('decisionList requires defining to be true', () => {
		expect(schema.nodes.decisionList.spec.defining).toBe(true);
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

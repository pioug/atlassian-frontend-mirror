import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { rule } from '../../../..';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema rule node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(rule).toStrictEqual({
			group: 'block',
			attrs: {
				localId: {
					default: null,
				},
			},
			parseDOM: [
				{
					tag: 'hr',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to <hr/>', () => {
		const html = toHTML(schema.nodes.rule.create(), schema);
		expect(html).toContain('<hr>');
	});

	it('matches <hr/>', () => {
		const doc = fromHTML('<hr/>', schema);
		const p = doc.firstChild!;
		expect(p.type.name).toEqual('rule');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'rule', 'text'],
	});
}

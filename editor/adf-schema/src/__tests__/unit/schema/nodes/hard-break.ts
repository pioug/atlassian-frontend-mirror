import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { hardBreak } from '../../../..';
import {
	doc,
	code_block,
	p,
	hardBreak as hardBreakNode,
} from '@af/adf-test-helpers/src/doc-builder';
import { Transform } from '@atlaskit/editor-prosemirror/transform';

const schema = makeSchema();
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema hardBreak node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(hardBreak).toStrictEqual({
			group: 'inline',
			inline: true,
			linebreakReplacement: true,
			attrs: {
				text: {
					default: '\n',
				},
				localId: {
					default: null,
				},
			},
			parseDOM: [
				{
					tag: 'br',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <br>', () => {
		const html = toHTML(schema.nodes.hardBreak.create(), schema);
		expect(html).toContain('<br>');
	});

	it('matches <br>', () => {
		const doc = fromHTML('<br>', schema);
		const br = doc.firstChild!.firstChild!;
		expect(br.type.name).toEqual('hardBreak');
	});

	it('hardBreak should replace newlines when a code block is converted to paragraph with setBlockType', () => {
		const originalDocument = doc(
			code_block({})(`const cat = 'meow';\nconst dog = 'woof';\n const bird = 'tweet';`),
		)(schema);

		const expectedDocument = doc(
			p(
				"const cat = 'meow';",
				hardBreakNode(),
				"const dog = 'woof';",
				hardBreakNode(),
				" const bird = 'tweet';",
			),
		)(schema);

		const tr = new Transform(originalDocument);

		tr.setBlockType(1, 1, schema.nodes.paragraph);
		expect(tr.doc.toString()).toEqual(expectedDocument.toString());
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'codeBlock', 'hardBreak'],
	});
}

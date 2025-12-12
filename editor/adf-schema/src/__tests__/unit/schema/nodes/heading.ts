import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { strong, doc as editorDoc, h1, a as link, em } from '@af/adf-test-helpers/src/doc-builder';
import { heading } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema heading node`, () => {
	const schema = makeSchema();

	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(heading).toStrictEqual({
			attrs: {
				level: {
					default: 1,
				},
				localId: {
					default: null,
				},
			},
			content: 'inline*',
			defining: true,
			group: 'block',
			marks:
				'link em strong strike subsup underline textColor annotation backgroundColor typeAheadQuery confluenceInlineComment unsupportedNodeAttribute unsupportedMark code dataConsumer fragment border',
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: 'h1',
				},
				{
					getAttrs: expect.anything(),
					tag: 'h2',
				},
				{
					getAttrs: expect.anything(),
					tag: 'h3',
				},
				{
					getAttrs: expect.anything(),
					tag: 'h4',
				},
				{
					getAttrs: expect.anything(),
					tag: 'h5',
				},
				{
					getAttrs: expect.anything(),
					tag: 'h6',
				},
			],
			selectable: false,
			toDOM: expect.anything(),
		});
	});

	it('serializes to <h4>', () => {
		const html = toHTML(schema.nodes.heading.create({ level: 4 }), schema);
		expect(html).toContain('<h4>');
	});

	it('matches <h3>', () => {
		const doc = fromHTML('<h3>', schema);
		const h3 = doc.firstChild!;
		expect(h3.type.name).toEqual('heading');
	});

	it('can have inline strong', () => {
		const doc = fromHTML('<h1><b>hello</b></h1>', schema);
		expect(doc.toJSON()).toEqual(editorDoc(h1(strong('hello')))(schema).toJSON());
	});

	it('can have inline italic', () => {
		const doc = fromHTML('<h1><em>hello</em></h1>', schema);
		expect(doc.toJSON()).toEqual(editorDoc(h1(em('hello')))(schema).toJSON());
	});

	it('can have inline links', () => {
		const doc = fromHTML(
			'<h1><a href="http://www.atlassian.com" rel="nofollow" title="@abodera" class="mention mention-me">hello</a></h1>',
			schema,
		);
		expect(doc.toJSON()).toEqual(
			editorDoc(h1(link({ href: 'http://www.atlassian.com' })('hello')))(schema).toJSON(),
		);
	});

	it('can have a localId attribute', () => {
		const html = toHTML(
			schema.nodes.heading.create({ level: 4, localId: 'some-local-id' }),
			schema,
		);
		expect(html).toContain('<h4 data-local-id="some-local-id"></h4>');
	});

	it('matches with localId attribute', () => {
		const doc = fromHTML('<h4 data-local-id="some-local-id">Hello World</h4>', schema);
		const p = doc.firstChild!;
		expect(p.type.name).toEqual('heading');
		expect(p.firstChild!.text!).toEqual('Hello World');
		expect(p.attrs!.localId).toEqual('some-local-id');
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'heading'],
		marks: ['strong', 'em', 'link'],
	});
}

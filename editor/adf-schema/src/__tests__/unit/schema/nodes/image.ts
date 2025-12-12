import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import { image } from '../../../..';

const schema = makeSchema();
const src = 'http://test.com';
const srcDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAY)';
const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema image node`, () => {
	// The node spec will be generated from ADF DSL
	// this test would detect any changes if this node is updated from ADF DSL
	it('should return correct node spec', () => {
		expect(image).toStrictEqual({
			attrs: {
				alt: {
					default: '',
				},
				src: {
					default: '',
				},
				title: {
					default: null,
				},
			},
			draggable: true,
			group: 'inline',
			inline: true,
			parseDOM: [
				{
					ignore: true,
					tag: 'img[src^="data:image/"]',
				},
				{
					getAttrs: expect.anything(),
					tag: 'img[src]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to <img>', () => {
		const html = toHTML(schema.nodes.image.create({ src }), schema);
		expect(html).toContain(`<img src="${src}" alt="">`);
	});

	it('matches <img src="...">', () => {
		const doc = fromHTML(`<img src="${src}" />`, schema);
		const img = doc.firstChild!.firstChild!;
		expect(img.type.name).toEqual('image');
	});

	it('does not match <img src="data:image/...">', () => {
		const doc = fromHTML(`<img src="${srcDataURI}" />`, schema);
		const img = doc.firstChild!.firstChild!;
		expect(img).toBeNull();
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text', 'image'],
	});
}

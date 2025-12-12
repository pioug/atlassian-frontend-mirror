import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { dataConsumer } from '../../../..';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema data-consumer mark`, () => {
	let schema: Schema;
	const firstSourceId = 'first-source-id';
	const secondSourceId = 'second-source-id';
	const dataSourceString = `&quot;${firstSourceId}&quot;,&quot;${secondSourceId}&quot;`;

	beforeEach(() => {
		schema = makeSchema();
	});

	// The mark spec will be generated from ADF DSL
	// this test would detect any changes if this mark is updated from ADF DSL
	it('should return correct mark spec', () => {
		expect(dataConsumer).toStrictEqual({
			attrs: {
				sources: {
					default: [],
				},
			},
			parseDOM: [
				{
					getAttrs: expect.anything(),
					tag: '[data-mark-type="dataConsumer"]',
				},
			],
			toDOM: expect.anything(),
		});
	});

	it('serializes to the correct HTML', () => {
		const node = schema.text('foo', [
			schema.marks.dataConsumer.create({
				sources: [firstSourceId, secondSourceId],
			}),
		]);
		const html = toHTML(node, schema);

		expect(html).toContain(`data-sources="[${dataSourceString}]"`);
		expect(html).toContain('data-mark-type="dataConsumer"');
	});

	it.each(['div', 'span'])('parses annotation correctly from html for %s', (wrapperType) => {
		const doc = fromHTML(
			`<${wrapperType} data-mark-type="dataConsumer" data-sources="[${dataSourceString}]">foo</${wrapperType}>`,
			schema,
		);
		const dataConsumerNode = doc.firstChild!;

		expect(dataConsumerNode.marks).toHaveLength(1);
		expect(dataConsumerNode.marks[0].type.name).toBe('dataConsumer');
		expect(dataConsumerNode.marks[0].attrs).toEqual({
			sources: [firstSourceId, secondSourceId],
		});
	});
});

function makeSchema() {
	return createSchema({
		nodes: ['doc', 'paragraph', 'text'],
		marks: ['dataConsumer'],
	});
}

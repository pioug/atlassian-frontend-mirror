import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import { doc, p, strong, expand, nestedExpand } from '@atlaskit/editor-test-helpers/doc-builder';
import WikiMarkupTransformer from '../../../index';

// This is a lossy conversion, expands get lost in converting to WikiMarkup
describe('ADF => WikiMarkup => ADF Round-trip - Expand', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert an expand', () => {
		const node = doc(expand({ title: 'Expand title' })(p('Expand content')))(defaultSchema);
		const wiki = transformer.encode(node);
		expect(wiki).toEqual('*Expand title*\n\n' + 'Expand content');

		const adf = transformer.parse(wiki).toJSON();
		const expected = doc(p(strong('Expand title')), p('Expand content'))(defaultSchema);
		expect(adf).toEqual(expected.toJSON());
	});

	test('should convert a nestedExpand inside an expand', () => {
		const node = doc(
			expand({ title: 'Parent expand title' })(
				nestedExpand({ title: 'Nested expand title' })(p('Nested expand content')),
			),
		)(defaultSchema);
		const wiki = transformer.encode(node);
		expect(wiki).toEqual(
			'*Parent expand title*\n\n' +
				'{adf:display=block}\n' +
				'{"type":"nestedExpand","attrs":{"title":"Nested expand title"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Nested expand content"}]}]}\n' +
				'{adf}',
		);

		const adf = transformer.parse(wiki).toJSON();
		const expected = doc(
			p(strong('Parent expand title')),
			expand({ title: 'Nested expand title' })(p('Nested expand content')),
		)(defaultSchema);
		expect(adf).toEqual(expected.toJSON());
	});
});

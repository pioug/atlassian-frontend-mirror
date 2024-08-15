import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, p, expand, nestedExpand } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Expand', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert an expand node', () => {
		const node = doc(expand({ title: 'Title' })(p('helloooooo')))(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(`
		"*Title*

		helloooooo"
	`);
	});

	test('should convert an expand node with a nested nestedExpand', () => {
		const node = doc(
			expand({ title: 'Title' })(
				p('helloooooo'),
				nestedExpand({ title: 'Oh god, such title goodness!' })(p('Joni Rules!')),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(`
		"*Title*

		helloooooo
		{adf:display=block}
		{"type":"nestedExpand","attrs":{"title":"Oh god, such title goodness!"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Joni Rules!"}]}]}
		{adf}"
	`);
	});
});

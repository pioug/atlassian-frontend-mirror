import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import {
	bodiedSyncBlock,
	blockquote,
	p,
	table,
	tr,
	td,
	doc,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - BodiedSyncBlock', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert a bodied sync block node', () => {
		const node = doc(
			bodiedSyncBlock({ resourceId: 'test-resource-id', localId: 'test-localId' })(
				blockquote(p('content')),
				p('test123'),
				table({ localId: '5b67f208-bd30-40bb-a8c4-12897cafd7dc' })(
					tr(td()(p('This is some text')), td()(p('td')), td()(p('td'))),
				),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchInlineSnapshot(`
		"{quote}content{quote}
		test123
		|This is some text|td|td|"
	`);
	});
});

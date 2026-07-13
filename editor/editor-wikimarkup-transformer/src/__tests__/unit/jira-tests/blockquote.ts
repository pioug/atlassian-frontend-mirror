import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { blockquote, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';

// Nodes

describe('WikiMarkup Transformer', () => {
	describe('blockquote', () => {
		const WIKI_NOTATION = `bq. some texts here`;

		checkParseEncodeRoundTrips(
			WIKI_NOTATION,
			defaultSchema,
			WIKI_NOTATION,
			doc(blockquote(p('some texts here'))),
		);
	});
});

import {
  blockquote,
  doc,
  li,
  p,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('quote', () => {
    const WIKI_NOTATION = `{quote}
* item1
* item2
{quote}

The end`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(blockquote(ul(li(p('item1')), li(p('item2'))), p('The end'))),
    );
  });
});

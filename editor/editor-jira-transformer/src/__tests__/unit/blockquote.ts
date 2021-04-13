import { doc, p, blockquote } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParse, checkParseEncodeRoundTrips } from './_test-helpers';
import { createJIRASchema } from '@atlaskit/adf-schema';

const schema = createJIRASchema({ allowBlockQuote: true, allowLists: true });

// Nodes

describe('JIRATransformer', () => {
  describe('blockquote', () => {
    checkParseEncodeRoundTrips(
      'simple content',
      schema,
      `<blockquote><p>content</p></blockquote>`,
      doc(blockquote(p('content'))),
    );

    checkParse(
      'empty node',
      schema,
      [`<blockquote></blockquote>`],
      doc(blockquote(p(''))),
    );

    checkParseEncodeRoundTrips(
      'no content',
      schema,
      `<blockquote><p></p></blockquote>`,
      doc(blockquote(p(''))),
    );
  });
});

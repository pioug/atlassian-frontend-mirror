import { doc, p, textColor } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('misc escaped and non-macros that should not resolve to anything', () => {
    let WIKI_NOTATION = `{$hello}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('{$hello}')),
    );

    WIKI_NOTATION = `\\\\{hello\\\\}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('{hello}')),
    );

    WIKI_NOTATION = `{color:red}Highlighting a \\\\{color} macro.{color}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(textColor({ color: '#FF0000' })('Highlighting a {color} macro.'))),
    );
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hardBreak,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('h1', () => {
    const WIKI_NOTATION = `h1. one`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h1('one')),
    );
  });

  describe('h2', () => {
    const WIKI_NOTATION = `h2. two`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h2('two')),
    );
  });

  describe('h3', () => {
    const WIKI_NOTATION = `h3. three`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h3('three')),
    );
  });

  describe('h4', () => {
    const WIKI_NOTATION = `h4. four`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h4('four')),
    );
  });

  describe('h5', () => {
    const WIKI_NOTATION = `h5. five`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h5('five')),
    );
  });

  describe('h6', () => {
    const WIKI_NOTATION = `h6. six`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h6('six')),
    );
  });

  describe('multiple headings', () => {
    const WIKI_NOTATION = `h4. Interfaces:
h5. Collection Testbed:
Status in testing`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(h4('Interfaces:'), h5('Collection Testbed:'), p('Status in testing')),
    );
  });

  describe('inline line breaks', () => {
    const WIKI_NOTATION = `h3. foo\\nBreak 1\\n\\nBreak 2\\n\\nBreak 3`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        h3('foo'),
        p('Break 1'),
        hardBreak(),
        p('Break 2'),
        hardBreak(),
        p('Break 3'),
      ),
    );
  });
});

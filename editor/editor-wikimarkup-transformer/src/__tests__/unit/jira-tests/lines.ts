import { doc, hr, p, strong } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('multiline', () => {
    const WIKI_NOTATION = `the first line
and the second one
finally the third!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('the first line'),
        p('and the second one'),
        p('finally the third!'),
      ),
    );
  });

  describe('line terminator', () => {
    const WIKI_NOTATION = `the first line\\n   and the second one`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line'), p('and the second one')),
    );
  });

  describe('line terminators with invisible whitespace', () => {
    const WIKI_NOTATION = `the first line\\n   second\\n   \\nand the third`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line'), p('   second'), p(''), p('and the third')),
    );
  });

  describe('bolded multiline', () => {
    const WIKI_NOTATION = `the first line\\n*bold line* here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('the first line'), p(strong('bold line'), 'here')),
    );
  });

  describe('dashes', () => {
    let WIKI_NOTATION = `-------`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('-------')),
    );

    WIKI_NOTATION = 'a-----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a-----')),
    );

    WIKI_NOTATION = 'a ----- bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a ----- bb')),
    );

    WIKI_NOTATION = 'a -----bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a -----bb')),
    );

    WIKI_NOTATION = 'a ----bb';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('a ----bb')),
    );

    WIKI_NOTATION = '----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(hr()),
    );

    WIKI_NOTATION = '-----';

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(hr()),
    );
  });

  describe('line breaks', () => {
    const WIKI_NOTATION = `the first line\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
and the second one\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
\\\\\\\\\\n\\
finally the third!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'the first line',
          hr(),
          hr(),
          hr(),
          hr(),
          hr(),
          'and the second one',
          hr(),
          hr(),
          hr(),
          'finally the third!',
        ),
      ),
    );
  });
});

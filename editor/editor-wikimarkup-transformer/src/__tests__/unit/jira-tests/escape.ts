import {
  a as link,
  doc,
  p,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('escaping bold and italic', () => {
    const WIKI_NOTATION = `This is not \\\\*bold\\\\* neither this one \\\\_italic\\\\_`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not &#42;bold&#42; neither this one &#95;italic&#95;')),
    );
  });

  describe('escaping links', () => {
    const WIKI_NOTATION = `This is not a link \\\\[spaceKey:pageTitle\\\\]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not a link [spaceKey:pageTitle]')),
    );
  });

  describe('escaping diffs', () => {
    const WIKI_NOTATION = `This is not \\\\+inserted\\\\+ neither this one \\\\-deleted\\\\-`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('This is not &#43;inserted&#43; neither this one &#45;deleted&#45;'),
      ),
    );
  });

  describe('escaping escapes', () => {
    const WIKI_NOTATION = `This is not an\\\\escaped\\\\phase as well as this \\\\ one!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not an\\\\escaped\\\\phase as well as this \\\\ one!')),
    );
  });

  describe('escaping many escapes', () => {
    const WIKI_NOTATION = `Not an \\\\\\\\\\\\\\\\\\\\\\\\*escaped phrase\\\\\\\\\\\\\\\\\\\\\\\\*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'Not an \\\\\\\\\\\\\\\\\\\\\\\\*escaped phrase\\\\\\\\\\\\\\\\\\\\\\\\*',
        ),
      ),
    );
  });

  describe('escaping mentions', () => {
    const WIKI_NOTATION = `Not \\\\@textbox\\\\@ and especially not an \\\\@-sign by itself`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('Not &#64;textbox&#64; and especially not an &#64;-sign by itself'),
      ),
    );
  });

  describe('escaping ampersand', () => {
    const WIKI_NOTATION = `Atlassian & Confluence`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('Atlassian &amp; Confluence')),
    );
  });

  describe('escaping comparison >', () => {
    const WIKI_NOTATION = `Just a comparison: 5>3`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('Just a comparison: 5&gt;3')),
    );
  });

  describe('escaping comparison <', () => {
    const WIKI_NOTATION = `Another comparison: 7 < 10`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('Another comparison: 7 &lt; 10')),
    );
  });

  describe('escaping double quotes', () => {
    const WIKI_NOTATION = `Wiki is a "nice" format!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('Wiki is a "nice" format!')),
    );
  });

  describe('escaping single quotes', () => {
    const WIKI_NOTATION = `Wiki is a 'nice' format!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`Wiki is a 'nice' format!`)),
    );
  });

  describe('escaping pre-encoded strings', () => {
    const WIKI_NOTATION = `Already encoded &amp; &lt; &lt; &quot;&quot; must stay unchanged`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(`Already encoded &amp; &lt; &lt; &quot;&quot; must stay unchanged`),
      ),
    );
  });

  describe('escaping en dash', () => {
    const WIKI_NOTATION = `Hello -- How are you`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`Hello &#8211; How are you`)),
    );
  });

  describe('escaping em dash', () => {
    const WIKI_NOTATION = `--- Hey! How are ya?`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`&#8212; Hey! How are ya?`)),
    );
  });

  describe('escaping en dash EOL', () => {
    const WIKI_NOTATION = `End of the line --`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`End of the line &#8211;`)),
    );
  });

  describe('escaping multiline', () => {
    const WIKI_NOTATION = `Middle -- of the line\\n\\
--- and start of the next line ---\\n\\
and the end!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          `Middle &#8211; of the line<br/>\\n\\`,
          hardBreak(),
          `&#8212; and start of the next line &#8212;<br/>\\n\\`,
          hardBreak(),
          `and the end!`,
        ),
      ),
    );
  });

  describe('escaping comparison &&', () => {
    const WIKI_NOTATION = `a && b`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`a &amp;&amp; b`)),
    );
  });

  describe('escaping many ampersand', () => {
    const WIKI_NOTATION = `a && && & & b`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`a &amp;&amp; &amp;&amp; &amp; &amp; b`)),
    );
  });

  describe('escaping URL expression', () => {
    const WIKI_NOTATION = `AUrlLike&amp;Expression`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`a &amp;&amp; &amp;&amp; &amp; &amp; b`)),
    );
  });

  describe('escaping single quote', () => {
    const WIKI_NOTATION = `How's it going?`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`How's it going?`)),
    );
  });

  describe('escaping link', () => {
    const WIKI_NOTATION = `A real URL here: ftps://atlassian.com/test?param1=val1&param2=val2`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          `A real URL here: `,
          link({ href: 'ftps://atlassian.com/test?param1=val1&param2=val2' })(
            'ftps://atlassian.com/test?param1=val1&param2=val2',
          ),
        ),
      ),
    );
  });

  describe('escaping non escape sequences', () => {
    const WIKI_NOTATION = `&#xFC`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`&amp;#xFC`)),
    );
  });
});

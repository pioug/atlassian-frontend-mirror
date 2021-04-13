import {
  a as link,
  blockquote,
  code,
  doc,
  em,
  emoji,
  p,
  strike,
  strong,
  subsup,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('strong', () => {
    let WIKI_NOTATION = `*strong text*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(strong('strong text'))),
    );

    WIKI_NOTATION = `text *strong text* text`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('text ', strong('strong text'), ' text')),
    );

    WIKI_NOTATION = `text *strong * text* text`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('text ', strong('strong * text'), ' text')),
    );

    WIKI_NOTATION = `well, both *space* and *page* words are in bold!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'well, both ',
          strong('space'),
          ' and ',
          strong('page'),
          ' words are in bold!',
        ),
      ),
    );

    WIKI_NOTATION = `**`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('**')),
    );

    WIKI_NOTATION = `just a bold text here *x*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('just a bold text here ', strong('x'))),
    );

    WIKI_NOTATION = `item1 *or* item2`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('item1 ', strong('or'), ' item2')),
    );

    WIKI_NOTATION = `a bold letter *x* followed by *more bold text*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'a bold letter ',
          strong('x'),
          ' followed by ',
          strong('more bold text'),
        ),
      ),
    );

    WIKI_NOTATION = `a bold letter {*}x{*} followed by *more bold text*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'a bold letter ',
          strong('x'),
          ' followed by ',
          strong('more bold text'),
        ),
      ),
    );

    WIKI_NOTATION = `word{*}containingbold* *more{*}bold even{*}more{*}bold`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'word',
          strong('containingbold'),
          ' ',
          strong('more'),
          'bold even',
          strong('more'),
          'bold',
        ),
      ),
    );

    WIKI_NOTATION = `bold to endof{*}line{*}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('bold to endof', strong('line'))),
    );

    WIKI_NOTATION = `*This should be strong*:-) This should not be strong`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          strong('This should be strong'),
          emoji({ shortName: ':slight_smile:' })(),
          ' This should not be strong',
        ),
      ),
    );

    WIKI_NOTATION = `*This should be strong*&nbsp; This should not be strong`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(strong('This should be strong'), '&nbsp; This should not be strong'),
      ),
    );

    WIKI_NOTATION = `I'd *REALLY LIKE TO EMPHASISE THIS*\\\\!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`I'd `, strong('REALLY LIKE TO EMPHASISE THIS'), '&#33;')),
    );

    WIKI_NOTATION = `*This should be strong*[http://www.google.com] This should not be strong`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          strong('This should be strong'),
          link({ href: 'http://www.google.com' })('http://www.google.com'),
        ),
        ' This should not be strong',
      ),
    );
  });

  describe('em', () => {
    let WIKI_NOTATION = `_emphasis text_`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(em('emphasis text'))),
    );

    WIKI_NOTATION = `item1 _or_ item2`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('item1 ', em('or'), ' item2')),
    );

    WIKI_NOTATION = `_italic_ text`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(em('italic text'))),
    );

    WIKI_NOTATION = `text as _italic_`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('tet as ', em('italic'))),
    );
  });

  // @TODO We don't have a node for this, using blockquote. Confirm with JIRA
  describe('citation', () => {
    let WIKI_NOTATION = `??citation text??`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(blockquote(p('citation text'))),
    );

    WIKI_NOTATION = `English??`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('English??')),
    );
  });

  describe('strikethrough', () => {
    let WIKI_NOTATION = `-deleted text-`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(strike('deleted text'))),
    );

    WIKI_NOTATION = `-deleted text - continued-`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(strike('deleted text - continued'))),
    );
  });

  // @TODO JIRA wraps an "ins" element around the text which underlines it, verify this is acceptable
  describe('underline', () => {
    let WIKI_NOTATION = `+inserted text+`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(underline('inserted text'))),
    );

    WIKI_NOTATION = `+ non inserted text +`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('+ non inserted text +')),
    );

    WIKI_NOTATION = `+ non inserted text+`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('+ non inserted text+')),
    );

    WIKI_NOTATION = `+non inserted text +`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('+non inserted text +')),
    );
  });

  describe('superscript', () => {
    let WIKI_NOTATION = `^superscript text^`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(subsup({ type: 'sup' })('superscript text'))),
    );

    WIKI_NOTATION = `some ^superscript texts^ here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('some ', subsup({ type: 'sup' })('superscript texts')), ' here'),
    );

    WIKI_NOTATION = `'19^th^ February'`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`'19`, subsup({ type: 'sup' })('th')), ` February'`),
    );
  });

  describe('subscript', () => {
    let WIKI_NOTATION = `~subscript text~`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(subsup({ type: 'sub' })('subscript text'))),
    );

    WIKI_NOTATION = `some ~subscript texts~ here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('some ', subsup({ type: 'sup' })('subscript texts')), ' here'),
    );
  });

  describe('monospaced', () => {
    const WIKI_NOTATION = `{{monospaced text}}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code('monospaced text'))),
    );
  });
});

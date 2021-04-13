import {
  code,
  code_block,
  doc,
  em,
  p,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('noformat with marks', () => {
    const WIKI_NOTATION = `{noformat} some *preformatted* texts here. so this is not a template @variable@ anymore! {noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code(
            ' some *preformatted* texts here. so this is not a template @variable@ anymore! ',
          ),
        ),
      ),
    );
  });

  describe('noformat multiline', () => {
    const WIKI_NOTATION = `{noformat} some *preformatted* multi line texts
here:



this is not a _emphesis_ text as well as a +inserted+ one{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        code_block({})(` some *preformatted* multi line texts
here:



this is not a _emphesis_ text as well as a +inserted+ one`),
      ),
    );
  });

  describe('noformat multiline with surrounding text', () => {
    const WIKI_NOTATION = `this is a *bold* text outside of _preformatted_ block {noformat} some *preformatted* multi line texts
here:



this is not a _emphesis_ text as well as a +inserted+ one{noformat} and here is the END of preformmatted block`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'this is a ',
          strong('bold'),
          ' text outside of ',
          em('preformatted'),
          ' block ',
        ),
        code_block({})(` some *preformatted* multi line texts
here:



this is not a _emphesis_ text as well as a +inserted+ one`),
        p(' and here is the END of preformmatted block'),
      ),
    );
  });

  describe('noformat with content between', () => {
    const WIKI_NOTATION = `{noformat}some *preformatted* texts here{noformat} then some *not preformatted* texts and finally {noformat}more _preformatted_ texts here{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code('some *preformatted* texts here'),
          ' then some ',
          strong('not preformatted'),
          ' texts and finally ',
          code('more _preformatted_ texts here'),
        ),
      ),
    );
  });

  describe('noformat with SQL', () => {
    const WIKI_NOTATION = `{noformat}INSERT INTO user VALUES ( 'localhost',<USER>,password( <PASS> ),'N','N' );{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code(
            `INSERT INTO user VALUES ( 'localhost',&lt;USER&gt;,password( &lt;PASS&gt; ),'N','N' );`,
          ),
        ),
      ),
    );
  });

  describe('noformat with color macro', () => {
    const WIKI_NOTATION = `{noformat}Well {color:red}this block should be in red{color} since it's inside no-format block{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code(
            `Well {color:red}this block should be in red{color} since it's inside no-format block`,
          ),
        ),
      ),
    );
  });

  describe('noformat on newline', () => {
    const WIKI_NOTATION = `foo's bar
{noformat}foo's bar{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(`foo's bar`), p(code(`foo's bar`))),
    );
  });

  describe('noformat links', () => {
    const WIKI_NOTATION = `{noformat}no hyper link like http://www.atlassian.com or [http://www.atlassian.com] or even [atlassian|http://www.atlassian.com] should get formatted{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code(
            `no hyper link like http://www.atlassian.com or [http://www.atlassian.com] or even [atlassian|http://www.atlassian.com] should get formatted`,
          ),
        ),
      ),
    );
  });

  describe('noformat emojis', () => {
    const WIKI_NOTATION = `{noformat}No emoticon like :-) or :D or even :-( should work here{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code(`No emoticon like :-) or :D or even :-( should work here`))),
    );
  });

  describe('noformat code', () => {
    const WIKI_NOTATION = `{noformat}foo("bar"){noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code(`foo("bar")`))),
    );
  });

  describe('noformat ordered list', () => {
    const WIKI_NOTATION = `{noformat}
### I like cheese
{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code(`### I like cheese`))),
    );
  });

  describe('noformat line terminator', () => {
    const WIKI_NOTATION = `{noformat}\\n   One\\n   Two\\n   Three{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code(`   One\\n   Two\\n   Three`))),
    );
  });

  describe('noformat filepaths', () => {
    const WIKI_NOTATION = `{noformat}
.
c:\\\\work\\\\_common\\\\code\\\\flash
c:\\\\work\\\\_tools\\\\flash7\\\\classes
{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code(`
.
c:\\\\work\\\\_common\\\\code\\\\flash
c:\\\\work\\\\_tools\\\\flash7\\\\classes`),
        ),
      ),
    );
  });

  describe('noformat filepath inline', () => {
    const WIKI_NOTATION = `blah {noformat:nopanel=true}c:\\\\work\\\\_common\\\\code\\\\flash *cat*{noformat} blah blah`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'blah ',
          code(`c:\\\\work\\\\_common\\\\code\\\\flash *cat*`),
          ' blah blah',
        ),
      ),
    );
  });
});

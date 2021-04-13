import {
  blockquote,
  code,
  code_block,
  doc,
  em,
  emoji,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  li,
  ol,
  p,
  panel,
  strike,
  strong,
  table,
  td,
  th,
  tr,
  ul,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('mixed headings, lists, and tables', () => {
    const WIKI_NOTATION = `h1. Heading
h2. Smaller heading
h3. Even smaller heading
h4. and smaller still heading
h5. almost smallest heading
h6. smallest heading

|simple|table

# numbered
# bullets
* normal
* bullets

bq. with some block quoted text

and *bold*, -strike- and _emphasised_ text.

||column||headings||
|table|with|
|cells|and|
|more|cells|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        h1('Heading'),
        h2('Smaller heading'),
        h3('Even smaller heading'),
        h4('and smaller still heading'),
        h5('almost smallest heading'),
        h6('smallest heading'),
        table()(tr(td({})(p('simple')), td({})(p('table')))),
        ol(li(p('numbered')), li(p('bullets'))),
        ul(li(p('normal')), li(p('bullets'))),
        blockquote(p('with some block quoted text')),
        p(
          'and ',
          strong('bold'),
          ' ',
          strike('strike'),
          ' and ',
          em('emphasised'),
          ' text.',
        ),
        table()(
          tr(th({})(p('column')), th({})(p('headings'))),
          tr(
            td({})(p('table')),
            td({})(p('with')),
            td({})(p('cells')),
            td({})(p('and')),
            td({})(p('more')),
            td({})(p('cells')),
          ),
        ),
      ),
    );
  });

  describe('mixed marks', () => {
    let WIKI_NOTATION = `This is definitely another page
*bold*
_italic*nonbold*foo_
*-strike-*
+under+
foo
bar
baz`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('This is definitely another page'),
        p(strong('bold')),
        p(em('italic*nonbold*foo')),
        p(strong(strike('strike'))),
        p(underline('under')),
        p('foo'),
        p('bar'),
        p('baz'),
      ),
    );

    WIKI_NOTATION = `{{What}} {{is}} {{wrong}} {{with}} {{this}}?
*Anything* *wrong* *with* *this*?
_How_ _about_ _this_?
{{Or}} _how_ *about* {{combinations}}?`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          code('What'),
          ' ',
          code('is'),
          ' ',
          code('wrong'),
          ' ',
          code('with'),
          ' ',
          code('this'),
          '?',
        ),
        p(
          strong('Anything'),
          ' ',
          strong('wrong'),
          ' ',
          strong('with'),
          ' ',
          strong('this'),
          '?',
        ),
        p(em('How'), ' ', em('about'), ' ', em('this'), '?'),
        p(
          code('Or'),
          ' ',
          em('how'),
          ' ',
          strong('about'),
          ' ',
          code('combinations'),
          '?',
        ),
      ),
    );
  });

  // @TODO We don't support bgColor for panels, confirm with JIRA
  // @TODO We don't support code block within a panel - it will be pulled out to block level - confirm with JIRA
  describe('panel with mixed content', () => {
    const WIKI_NOTATION = `* ConfigTest
{panel:bgColor=white}
A config file here:
{code:xml}
<tests>
    <test>first test</test>
    <test>second test</test>
    <test>third test</test>
</tests>
{code}
end of the config file!
{panel}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('ConfigTest')),
          panel()(p('A config file here:')),
          code_block({})(
            `<tests>
    <test>first test</test>
    <test>second test</test>
    <test>third test</test>
</tests>`,
          ),
          panel()(p('end of the config file!')),
        ),
      ),
    );
  });

  describe('mixed table notation with bangs', () => {
    const WIKI_NOTATION = `| (!) | Hello | (!) |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(
            td({})(p(' ', emoji({ shortName: ':warning:' })(), ' ')),
            td({})(p(' Hello ')),
            td({})(p(' ', emoji({ shortName: ':warning:' })(), ' ')),
          ),
        ),
      ),
    );
  });
});

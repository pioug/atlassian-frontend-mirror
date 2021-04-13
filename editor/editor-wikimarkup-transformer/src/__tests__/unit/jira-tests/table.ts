import {
  a as link,
  code,
  doc,
  em,
  h2,
  hardBreak,
  li,
  ol,
  p,
  strong,
  table,
  td,
  th,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('table with content around it', () => {
    const WIKI_NOTATION = `before table
||colA||colB||colC||colD||
|cola|colb|colc|cold|

after table`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('before table'),
        table()(
          tr(
            th({})(p('colA')),
            th({})(p('colB')),
            th({})(p('colC')),
            th({})(p('colD')),
          ),
          tr(
            td({})(p('cola')),
            td({})(p('colb')),
            td({})(p('colc')),
            td({})(p('cold')),
          ),
        ),
        p(),
        p('after table'),
      ),
    );
  });

  describe('table with open rows', () => {
    const WIKI_NOTATION = `||column||headings
|table|with
|more|cells`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p('column')), th({})(p('headings'))),
          tr(td({})(p('table')), td({})(p('with'))),
          tr(td({})(p('more')), td({})(p('cells'))),
        ),
      ),
    );
  });

  describe('table with closed rows', () => {
    const WIKI_NOTATION = `||column||headings||
|table|with|
|more|cells|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p('column')), th({})(p('headings'))),
          tr(td({})(p('table')), td({})(p('with'))),
          tr(td({})(p('more')), td({})(p('cells'))),
        ),
      ),
    );
  });

  describe('single row unclosed table', () => {
    const WIKI_NOTATION = `|simple|table`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(table()(tr(td({})(p('simple')), td({})(p('table'))))),
    );
  });

  describe('unclosed table with other macros', () => {
    const WIKI_NOTATION = `|simple|table
|[a link|http://www.domain.com]|simple text
|more texts|[link to google|confluence@Google]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(td({})(p('simple')), td({})(p('table'))),
          tr(
            td({})(p(link({ href: 'http://www.domain.com' })('a link'))),
            td({})(p('simple text')),
          ),
          tr(
            td({})(p('more texts')),
            td({})(p(link({ href: 'confluence@Google' })('link to google'))),
          ),
        ),
      ),
    );
  });

  describe('table header only', () => {
    const WIKI_NOTATION = `||header|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(table()(tr(th({})(p('header'))))),
    );
  });

  describe('table with header column and header row', () => {
    const WIKI_NOTATION = `| ||col1||col2||
||row1|a |b|
||row2|a | |
||row3| |b|
||row4| | |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(td({})(p(' ')), th({})(p('col1')), th({})(p('col2'))),
          tr(th({})(p('row1')), td({})(p('a ')), td({})(p('b'))),
          tr(th({})(p('row2')), td({})(p('a ')), td({})(p(' '))),
          tr(th({})(p('row3')), td({})(p(' ')), td({})(p('b'))),
          tr(th({})(p('row4')), td({})(p(' ')), td({})(p(' '))),
        ),
      ),
    );
  });

  describe('table missing final end column', () => {
    const WIKI_NOTATION = `||table||header||here||
|and|a row|here|
|and|the|end`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p('table')), th({})(p('header')), th({})(p('here'))),
          tr(td({})(p('and')), td({})(p('a row')), td({})(p('here'))),
          tr(td({})(p('and')), td({})(p('the')), td({})(p('end'))),
        ),
      ),
    );
  });

  describe('table with multiline cells', () => {
    const WIKI_NOTATION = `||table header||here||
|and|here
the *data* and
|even more|_and more_
data`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p('table header')), th({})(p('here'))),
          tr(
            td({})(p('and')),
            td({})(p('here', hardBreak(), 'the ', strong('data'), ' and')),
          ),
          tr(
            td({})(p('even more')),
            td({})(p(em('and more'), hardBreak(), 'data')),
          ),
        ),
      ),
    );
  });

  describe('table with noformat', () => {
    const WIKI_NOTATION = `The following example:
|| test | {noformat}foo{noformat} |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('The following example:'),
        table()(tr(th({})(p(' test ')), td({})(p(' ', code('foo'), ' ')))),
      ),
    );
  });

  describe('unclosed table with multiline cell', () => {
    const WIKI_NOTATION = `||aaa||bbb||ccc
|ddd|eee|fff
  gggg hhhh


h2. header`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('The following example:'),
        table()(
          tr(th({})(p('aaa')), th({})(p('bbb')), th({})(p('ccc'))),
          tr(
            td({})(p('ddd')),
            td({})(p('eee')),
            td({})(p('fff', hardBreak(), '  gggg hhhh')),
          ),
        ),
        h2('header'),
      ),
    );
  });

  describe('single cell with link', () => {
    const WIKI_NOTATION = `|[foo|http://www.example.com]|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(tr(td({})(p(link({ href: 'http://www.example.com' })('foo'))))),
      ),
    );
  });

  // @TODO We don't support this so it will split the list, confirm with JIRA
  describe('table in a list', () => {
    const WIKI_NOTATION = `# Item 1
# Item 2
# Item 3
||Table||Header||Here
|and|a|row
|the|last|row
# Item 4
## Item 4.1
## Item 4.2
## Item 4.3
# Item 5`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ol(li(p('Item 1')), li(p('Item 2')), li(p('Item 3'))),
        table()(
          tr(th({})(p('Table')), th({})(p('Header')), th({})(p('Here'))),
          tr(td({})(p('and')), td({})(p('a')), td({})(p('row'))),
          tr(td({})(p('the')), td({})(p('last')), td({})(p('row'))),
        ),
        ol(
          li(
            p(
              'Item 4',
              ol(li(p('Item 4.1')), li(p('Item 4.2')), li(p('Item 4.3'))),
            ),
          ),
          li(p('Item 5')),
        ),
      ),
    );
  });

  describe('list in a table', () => {
    const WIKI_NOTATION = `||Table||Header
|Here is my list
* Item A
* Item B
* Item C|and the second cell
|another|row`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p('Table')), th({})(p('Header'))),
          tr(
            td({})(
              p(
                'Here is my list',
                ul(li(p('Item A')), li(p('Item B')), li(p('Item C'))),
              ),
            ),
            td({})(p('and the second cell')),
          ),
          tr(td({})(p('another')), td({})(p('row'))),
        ),
      ),
    );
  });

  describe('list with table notation', () => {
    const WIKI_NOTATION = `* I like | cheese
* I like | cheese
* I like cheese |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('I like | cheese')),
          li(p('I like | cheese')),
          li(p('I like cheese |')),
        ),
      ),
    );
  });

  describe('table with multiple lists', () => {
    const WIKI_NOTATION = `|| Column One || Column Two ||
| List One | List one consists of:
* This is a list
** This is a sublist
* This is the list again |
| List Two | List two consists of:
* This is a list
** This is a sublist
* This is the list again|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table()(
          tr(th({})(p(' Column One ')), th({})(p(' Column Two '))),
          tr(
            td({})(p(' List One ')),
            td({})(
              p(
                'List one consists of:',
                ul(
                  li(p('This is a list', ul(li(p('This is a sublist'))))),
                  li(p('This is the list again')),
                ),
              ),
            ),
          ),
          tr(
            td({})(p(' List Two ')),
            td({})(
              p(
                'List two consists of:',
                ul(
                  li(p('This is a list', ul(li(p('This is a sublist'))))),
                  li(p('This is the list again')),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  });

  // @TODO We don't support this so it will split the list, confirm with JIRA
  describe('table between lists', () => {
    const WIKI_NOTATION = `* List Item 1
|| Column 1 || Column 2 ||
| Cell 1 | Cell 2 |
* List Item 2
* List Item 3
|| Column 3 || Column 4 ||
| Cell 3 | Cell 4 |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(li(p('List Item 1'))),
        table()(
          tr(th({})(p(' Column 1 ')), th({})(p(' Column 2 '))),
          tr(td({})(p(' Cell 1 ')), td({})(p(' Cell 2 '))),
        ),
        ul(li(p('List Item 2')), li(p('List Item 3'))),
        table()(
          tr(th({})(p(' Column 2 ')), th({})(p(' Column 4 '))),
          tr(td({})(p(' Cell 3 ')), td({})(p(' Cell 4 '))),
        ),
      ),
    );
  });
});

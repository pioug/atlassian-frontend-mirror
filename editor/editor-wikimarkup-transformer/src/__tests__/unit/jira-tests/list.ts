import {
  a as link,
  code,
  doc,
  h2,
  hardBreak,
  img,
  li,
  ol,
  p,
  ul,
  strong,
  textColor,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('escaped list', () => {
    const WIKI_NOTATION = `\\* aaa
\\# bbb
\\- ccc`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '&#42; aaa',
          hardBreak(),
          '&#35; bbb',
          hardBreak(),
          '&#45; ccc',
          hardBreak(),
        ),
      ),
    );
  });

  describe('bullet list', () => {
    const WIKI_NOTATION = `* aaa
* bbb
* ccc
* ddd
* eee`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('aaa')),
          li(p('bbb')),
          li(p('ccc')),
          li(p('ddd')),
          li(p('eee')),
        ),
      ),
    );
  });

  // @TODO This converts to the default bullet list styles - confirm with JIRA
  describe('dash list', () => {
    const WIKI_NOTATION = `- aaa
- bbb
- ccc
- ddd
- eee`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('aaa')),
          li(p('bbb')),
          li(p('ccc')),
          li(p('ddd')),
          li(p('eee')),
        ),
      ),
    );
  });

  describe('split lists', () => {
    const WIKI_NOTATION = `* aaa
* bbb
* ccc

* ddd
* eee
* fff`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(li(p('aaa')), li(p('bbb')), li(p('ccc'))),
        ul(li(p('ddd')), li(p('eee')), li(p('fff'))),
      ),
    );
  });

  describe('ordered lists', () => {
    const WIKI_NOTATION = `# one
# two
## two-one
## two-two
# three
# four
## four-one`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ol(
          li(p('two'), ol(li(p('two-one')), li(p('two-two')))),
          li(p('three')),
          li(p('four'), ol(li(p('four-one')))),
        ),
      ),
    );
  });

  describe('indented lists', () => {
    const WIKI_NOTATION = `* aaa
* bbb
 * ccc
  * ddd
* eee`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('aaa')),
          li(p('bbb')),
          li(p('ccc')),
          li(p('ddd')),
          li(p('eee')),
        ),
      ),
    );
  });

  describe('malformed lists', () => {
    const WIKI_NOTATION = `* aaa
* bbb
* ccc
*ddd
*eee
* ffff
** ggggg`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('aaa')),
          li(p('bbb')),
          li(p('ccc', hardBreak(), 'ddd', hardBreak(), 'eee')),
        ),
        ul(li(p('ffff'), ul(li(p('ggggg'))))),
      ),
    );
  });

  describe('lists with other notation', () => {
    const WIKI_NOTATION = `- aaa
- bbb \\\\| another bbb
- ccc
- ddd`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('aaa')),
          li(p('bbb &#124; another bbb')),
          li(p('ccc')),
          li(p('ddd')),
        ),
      ),
    );
  });

  describe('mixed lists', () => {
    const WIKI_NOTATION = `some texts here
- jobs to do
* more jobs to do`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('some texts here'),
        ul(li(p('jobs to do'))),
        ul(li(p('more jobs to do'))),
      ),
    );
  });

  describe('ordered lists with nested unordered lists', () => {
    const WIKI_NOTATION = `Just a list:
# first item
# second item
** another1 item
** another2 item
# unknown item`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('Just a list:'),
        ol(
          li(p('first item')),
          li(
            p('second item'),
            ul(li(p('another1 item')), li(p('another2 item'))),
          ),
          li(p('unknown item')),
        ),
      ),
    );
  });

  describe('indented list', () => {
    const WIKI_NOTATION = `** An item`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(ul(li(ul(li(p('An item')))))),
    );
  });

  describe('mixed indentation', () => {
    const WIKI_NOTATION = `Just a list:
# one
## two
## three
** four
# five`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('Just a list:'),
        ol(
          li(p('one'), ol(li(p('two')), li(p('three'))), ul(li(p('four')))),
          li(p('five')),
        ),
      ),
    );
  });

  describe('deep indentation', () => {
    const WIKI_NOTATION = `# foo
**** bar
# baz`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(ol(li(p('foo'), ul(li(ul(li(ul(li(p('bar')))))))), li(p('baz')))),
    );
  });

  describe('lists with bolded items', () => {
    const WIKI_NOTATION = `* *bold test*
** *deeper test*
* normal test`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p(strong('bold test')), ul(li(p(strong('deeper test'))))),
          li(p('normal test')),
        ),
      ),
    );
  });

  describe('multilevel lists', () => {
    const WIKI_NOTATION = `* Middleware Configuration
* Core Collection Drivers
** JDBC Driver
*** JDBC Collection Driver
*** JDBC Metadata Driver
**** JDBC Template Report Configuration
**** JDBC URL Report Configuration
***** Generating Reports from JSP and other sources
*** JDBC Query Driver`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('Middleware Configuration')),
          li(
            p('Core Collection Drivers'),
            ul(
              li(
                p('JDBC Driver'),
                ul(
                  li(p('JDBC Collection Driver')),
                  li(
                    p('JDBC Metadata Driver'),
                    ul(
                      li(p('JDBC Template Report Configuration')),
                      li(
                        p('JDBC URL Report Configuration'),
                        ul(
                          li(
                            p('Generating Reports from JSP and other sources'),
                          ),
                        ),
                      ),
                    ),
                  ),
                  li(p('JDBC Query Driver')),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  });

  describe('split lists', () => {
    const WIKI_NOTATION = ` first item
* second item
second item, second part
and the third section
* third item
** third.one item`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(' first item'),
        ul(
          li(
            p(
              'second item',
              hardBreak(),
              'second item, second part',
              hardBreak(),
              'and the third section',
            ),
          ),
          li(p('third item'), ul(li(p('third.one item')))),
        ),
      ),
    );
  });

  describe('list with noformat', () => {
    const WIKI_NOTATION = `h2.Just a list here
# item one {noformat}a preformatted *block* and more{noformat}
# second item
# then {noformat}another _preformatted_ block{noformat}
#- as mentioned, the above is a preformatted block
# third item {noformat}and the last/preformatted/block{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        h2('Just a list here'),
        ol(
          li(p('item one ', code('a preformatted *block* and more'))),
          li(p('second item')),
          li(
            p('then ', code('another _preformatted_ block')),
            ul(li(p('as mentioned, the above is a preformatted block'))),
          ),
          li(p('third item ', code('and the last/preformatted/block'))),
        ),
      ),
    );
  });

  describe('list with links', () => {
    const WIKI_NOTATION = `# Just
# Some
# [link to yahoo|http://www.yahoo.com]
# and
# [link to atlassian|http://www.atlassian.com]
# here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ol(
          li(p('Just')),
          li(p('Some')),
          li(p(link({ href: 'http://www.yahoo.com' })('link to yahoo'))),
          li(p('and')),
          li(
            p(link({ href: 'http://www.atlassian.com' })('link to atlassian')),
          ),
          li(p('here')),
        ),
      ),
    );
  });

  describe('list with nested ol', () => {
    const WIKI_NOTATION = `* List item one
* List item two
* List item three
## List item two
## List item three
## List item four
## List item five
* List item six`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ol(
          li(p('List item one')),
          li(p('List item two')),
          li(
            p('List item three'),
            ol(
              li(p('List item two')),
              li(p('List item three')),
              li(p('List item four')),
              li(p('List item five')),
            ),
          ),
          li(p('List item six')),
        ),
      ),
    );
  });

  describe('list with long item', () => {
    const WIKI_NOTATION = `* Follow these instructions and then click *Next*.\\\\\\\\{color:red}*Tip:*{color} You can copy and paste the required information.\\\\\\\\ \\\\\\\\ !Helpful Image.jpg! \\\\\\\\ \\\\\\\\\\n\\
* Another bulleted item.`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ol(
          li(
            p(
              'Follow these instructions and then click ',
              strong('Next'),
              '.',
              hardBreak(),
              textColor({ color: '#F00' })(strong('Tip:')),
              ' You can copy and paste the required information.',
              hardBreak(),
              img({ src: 'Helpful Image.jpg' })(), // @TODO media?
            ),
          ),
          li(p('Another bulleted item.')),
        ),
      ),
    );
  });

  describe('list with long item', () => {
    const WIKI_NOTATION = `* item1
* item2
  still item2
  * item3

h2. header`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        ul(
          li(p('item1')),
          li(p('item2', hardBreak(), 'still item2')),
          li(p('item3')),
        ),
        h2('header'),
      ),
    );
  });
});

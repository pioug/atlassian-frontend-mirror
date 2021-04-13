import {
  doc,
  p,
  a as link,
  code_block,
  img,
  strong,
  em,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('link with inline macro', () => {
    const WIKI_NOTATION = `[http://www.my{color:red}host{color}.com]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com' })('http://www.myhost.com'))),
    );
  });

  describe('coloured link', () => {
    const WIKI_NOTATION = `[{color:red}Text{color}|http://www.myhost.com]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com' })('Text'))),
    );
  });

  describe('link tooltip', () => {
    const WIKI_NOTATION = `[Text|http://www.myhost.com|{color:red}Tooltip{color}]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com', title: 'Tooltip' })('Text'))),
    );
  });

  describe('noformat link', () => {
    const WIKI_NOTATION = `[http://www.my{noformat}host{noformat}.com]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[http://www.my'), code_block({})('host'), p('.com]')),
    );
  });

  describe('in image macro', () => {
    const WIKI_NOTATION = `!http://example.com/?{color}insection{color}!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          img({
            src:
              'http://example.com/?%3Cfont+color%3D%22%22%3Einsection%3C%2Ffont%3E',
          })(),
        ),
      ),
    );
  });

  describe('noformat in image macro', () => {
    const WIKI_NOTATION = `!http://example.com/?{noformat}insection{noformat}!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('!http://example.com/?'), code_block({})('insection'), p('!')),
    );
  });

  describe('image macro with file', () => {
    const WIKI_NOTATION = `!http://example.com/|fake=[file://z:/onerror=alert(/not_fixed/)//]!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/' })())),
    );
  });

  describe('image macro with external link', () => {
    const WIKI_NOTATION = `[!http://example.com/?insection!|http://www.myhost.com]`;

    // @TODO ADF doesn't support custom linkable images, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/?insection' })())),
    );
  });

  describe('link with image macro as title', () => {
    const WIKI_NOTATION = `[Text|http://www.myhost.com|!http://example.com/?insection!"]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href: 'http://www.myhost.com',
            title: '!http://example.com/?insection!"',
          })('Text'),
        ),
      ),
    );
  });

  describe('inside a noformat', () => {
    const WIKI_NOTATION = `{noformat}[Text|http://www.myhost.com]{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code_block({})('[Text|http://www.myhost.com]'))),
    );
  });

  describe('image macro inside a color macro', () => {
    const WIKI_NOTATION = `{color}!http://example.com/?insection!{color}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/?insection' })())),
    );
  });

  describe('image macro inside a noformat', () => {
    const WIKI_NOTATION = `{noformat}!http://example.com/?insection!{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code_block({})('!http://example.com/?insection!'))),
    );
  });

  describe('escaped link macro', () => {
    const WIKI_NOTATION = `\\[http://confluence.atlassian.com]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[http://confluence.atlassian.com]')),
    );
  });

  describe('plain link', () => {
    const WIKI_NOTATION = `[http://confluence.atlassian.com]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://confluence.atlassian.com' })(
            'http://confluence.atlassian.com',
          ),
        ),
      ),
    );
  });

  describe('link with text', () => {
    const WIKI_NOTATION = `[confluence|http://confluence-url.atlassian.com:10090]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://confluence-url.atlassian.com:10090' })(
            'confluence',
          ),
        ),
      ),
    );
  });

  describe('link with text and title', () => {
    const WIKI_NOTATION = `[confluence2|http://confluence_url_no2.atlassian.com:10090|more description here]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href: 'http://confluence_url_no2.atlassian.com:10090',
            title: 'more description here',
          })('confluence2'),
        ),
      ),
    );
  });

  describe('IRC link', () => {
    const WIKI_NOTATION = `[an IRC link|irc://atlassian.com/confluence]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'irc://atlassian.com/confluence' })('an IRC link'))),
    );
  });

  describe('link macros with marks', () => {
    const WIKI_NOTATION = `[*bold link*|http://www.yahoo.com/search?query=hello]
[Try _this_ link|http://www.atlassian.com]
[_italic_|http://confluence.atlassian.com]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          strong(
            link({ href: 'http://www.yahoo.com/search?query=hello' })(
              'bold link',
            ),
          ),
        ),
        p(
          link({ href: 'http://www.atlassian.com' })('try '),
          em(link({ href: 'http://www.atlassian.com' })('this')),
          link({ href: 'http://www.atlassian.com' })(' link'),
        ),
        p(em(link({ href: 'http://confluence.atlassian.com' })('italic'))),
      ),
    );
  });

  describe('non links', () => {
    let WIKI_NOTATION = `[  ]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[  ]')),
    );

    WIKI_NOTATION = `[]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[]')),
    );

    WIKI_NOTATION = `[ x ]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[ x ]')),
    );

    WIKI_NOTATION = `[[http://confluence.atlassian.com]]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '[',
          link({ href: 'http://confluence.atlassian.com' })(
            'http://confluence.atlassian.com',
          ),
          ']',
        ),
      ),
    );

    WIKI_NOTATION = `This [] is not a link!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This [] is not a link!')),
    );

    // @TODO error span?
    WIKI_NOTATION = `An invalid URL: [invalid://nowhere.com/hello]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('An invalid URL: &#91;invalid://nowhere.com/hello&#93;')),
    );

    WIKI_NOTATION = `[Another invalid URL|invalid://nowhere.com/hello]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('&#91;Another invalid URL|invalid://nowhere.com/hello&#93;')),
    );
  });

  describe('links with marks to be ignored', () => {
    let WIKI_NOTATION = `[http://cvs.example.com/*checkout*/foo/Bar.java]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://cvs.example.com/*checkout*/foo/Bar.java' })(
            'http://cvs.example.com/*checkout*/foo/Bar.java',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `http://cvs.example.com/*checkout*/foo/Bar.java`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://cvs.example.com/*checkout*/foo/Bar.java' })(
            'http://cvs.example.com/*checkout*/foo/Bar.java',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `[http://cvs.example.com/~checkout~/foo/Bar.java]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://cvs.example.com/~checkout~/foo/Bar.java' })(
            'http://cvs.example.com/~checkout~/foo/Bar.java',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `http://cvs.example.com/~checkout~/foo/Bar.java`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://cvs.example.com/~checkout~/foo/Bar.java' })(
            'http://cvs.example.com/~checkout~/foo/Bar.java',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `http://foo.com/xx(yy)zz.java)`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://foo.com/xx(yy)zz.java)' })(
            'http://foo.com/xx(yy)zz.java)',
          ),
        ),
      ),
    );
  });

  describe('XSS link', () => {
    const WIKI_NOTATION = `[<script>alert("Haha!")</script>|invalid://nowhere.com/hello]`;

    // @TODO error span?
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          '&#91;&lt;script&gt;alert(&quot;Haha!&quot;)&lt;/script&gt;|invalid://nowhere.com/hello&#93;',
        ),
      ),
    );
  });

  describe('XSS macros', () => {
    let WIKI_NOTATION = `http://[http://onmouseover=alert(0)//]`;

    // @TODO error span?
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://[http://onmouseover=alert(0)//]' })(
            'http://[http://onmouseover=alert(0)//]',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `http://!http://onmouseover=alert(0)//!`;

    // @TODO error span?
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({ href: 'http://!http://onmouseover=alert(0)//!' })(
            'http://!http://onmouseover=alert(0)//!',
          ),
        ),
      ),
    );

    WIKI_NOTATION = `[http://a.b.com/c?url=http://a.b.com/rest?gadget=http://a.b.com/gadgets&container=atlassian]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href:
              'http://a.b.com/c?url=http://a.b.com/rest?gadget=http://a.b.com/gadgets&container=atlassian',
          })(
            'http://a.b.com/c?url=http://a.b.com/rest?gadget=http://a.b.com/gadgets&amp;container=atlassian',
          ),
        ),
      ),
    );
  });
});

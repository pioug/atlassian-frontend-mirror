import { editorTestCase as test, expect } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  doc,
  p,
  textColor,
  strong,
  em,
  code,
  underline,
  a,
  strike,
  ul,
  ol,
  li,
  panel,
  code_block,
  hardBreak,
  decisionList,
  decisionItem,
  h3,
  inlineCard,
  mediaInline,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('paste: libra', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('paste tests on fullpage editor: plain text', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: 'This text is plain.',
    });
    await expect(editor).toHaveDocument(doc(p('This text is plain.')));
  });

  test('paste tests on fullpage editor: bullet list', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<ul><li><p>list ele 1</p></li><li><p>list ele 2</p><ul><li><p>more ele 1</p></li><li><p>more ele 2</p></li></ul></li><li><p>this is the last ele</p></li></ul>',
    });
    await expect(editor).toHaveDocument(
      doc(
        ul(
          li(p('list ele 1')),
          li(p('list ele 2'), ul(li(p('more ele 1')), li(p('more ele 2')))),
          li(p('this is the last ele')),
        ),
      ),
    );
  });

  test('paste tests on fullpage editor: ordered list', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<ol><li><p>this is ele1</p></li><li><p>this is a link <a href="http://www.google.com">www.google.com</a></p><ol><li><p>more elements with some <strong>format</strong></p></li><li><p>some addition<em> formatting</em></p></li></ol></li><li><p>last element</p></li></ol>',
    });
    await expect(editor).toHaveDocument(
      doc(
        ol()(
          li(p('this is ele1')),
          li(
            p(
              'this is a link ',
              a({ href: 'http://www.google.com' })('www.google.com'),
            ),
            ol()(
              li(p('more elements with some ', strong('format'))),
              li(p('some addition', em(' formatting'))),
            ),
          ),
          li(p('last element')),
        ),
      ),
    );
  });

  test('paste tests on fullpage editor with restart numbered lists: ordered list', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<ol><li><p>this is ele1</p></li><li><p>this is a link <a href="http://www.google.com">www.google.com</a></p><ol><li><p>more elements with some <strong>format</strong></p></li><li><p>some addition<em> formatting</em></p></li></ol></li><li><p>last element</p></li></ol>',
    });
    await expect(editor).toHaveDocument(
      doc(
        ol()(
          li(p('this is ele1')),
          li(
            p(
              'this is a link ',
              a({ href: 'http://www.google.com' })('www.google.com'),
            ),
            ol()(
              li(p('more elements with some ', strong('format'))),
              li(p('some addition', em(' formatting'))),
            ),
          ),
          li(p('last element')),
        ),
      ),
    );
  });

  test('code block copied from renderer and pasted', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<div class="ak-renderer-document"><p data-renderer-start-pos="1">hello</p><div class="code-block"><span data-ds--code--code-block=""><code><span class="linenumber react-syntax-highlighter-line-number">1</span><span>world</span></code></span></div></div>',
    });
    await expect(editor).toHaveDocument(
      doc(p('hello'), code_block({})('world'), p()),
    );
  });

  test('paste tests on fullpage editor: hyperlink', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: 'https://www.atlassian.com',
    });
    await expect(editor).toHaveDocument(
      doc(
        p(
          a({ href: 'https://www.atlassian.com' })('https://www.atlassian.com'),
        ),
      ),
    );
  });

  test(`paste tests on fullpage editor: plain text with leading and trailing whitespaces and newlines`, async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: '  text with 2 leading whitespaces\n  text with 2 leading and trailing whitespaces  \ntext with 2 trailing whitespaces  \n\n  text with leading tab and 2 trailing whitespaces  \n  text with leading and trailing tab  \r\ntext with 2 trailing whitespaces  ',
    });
    await expect(editor).toHaveDocument(
      doc(
        p(
          '  text with 2 leading whitespaces',
          hardBreak(),
          '  text with 2 leading and trailing whitespaces  ',
          hardBreak(),
          'text with 2 trailing whitespaces  ',
        ),
        p(
          '  text with leading tab and 2 trailing whitespaces  ',
          hardBreak(),
          '  text with leading and trailing tab  ',
          hardBreak(),
          'text with 2 trailing whitespaces  ',
        ),
      ),
    );
  });

  test('paste code with new lines into code block. ensure up arrow is working', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text: '// Your First C++ Program\r\n\r\n#include <iostream>\r\n\r\nint main() {\r\n    std::cout << "Hello World!";\r\n    return 0;\r\n}\r\n',
    });
    await expect(editor).toHaveDocument(
      doc(
        p('// Your First C++ Program'),
        p('#include <iostream>'),
        p(
          'int main() {',
          hardBreak(),
          '    std::cout << "Hello World!";',
          hardBreak(),
          '    return 0;',
          hardBreak(),
          '}',
        ),
      ),
    );

    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.type('a');

    await expect(editor).toHaveDocument(
      doc(
        p('a// Your First C++ Program'),
        p('#include <iostream>'),
        p(
          'int main() {',
          hardBreak(),
          '    std::cout << "Hello World!";',
          hardBreak(),
          '    return 0;',
          hardBreak(),
          '}',
        ),
      ),
    );
  });

  test('decision item pasted', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">xx</p><ol data-node-type="decisionList" data-decision-list-local-id="e04fcc6e-51e4-4521-9df6-bb1281bffa92" style="list-style: none; padding-left: 0"><li data-decision-local-id="137535a4-4a1f-4188-a9ce-ab58ca816984" data-decision-state="DECIDED">Decision 1</li><li data-decision-local-id="137535a4-4a1f-4188-a9ce-ab58ca816984" data-decision-state="DECIDED">Decision 2</li></ol><h3>h3</h3><p></p>`,
    });

    await expect(editor).toMatchDocument(
      doc(
        p('xx'),
        decisionList({ localId: 'c278c59d-7815-4d37-80de-998aa4472206' })(
          decisionItem({ localId: '30014be1-1e91-4248-b4c8-50b30e9e2fbf' })(
            'Decision 1',
          ),
          decisionItem({ localId: '6cdbfe6d-c988-4b51-8d70-beca799df3c4' })(
            'Decision 2',
          ),
        ),
        h3('h3'),
        p(),
      ),
    );
  });
});

test.describe('paste: libra - panel', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
    },
  });

  test('paste tests on fullpage editor: block node containing paragraph containing hardbreak and list', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<div data-panel-type="info" data-pm-slice="0 0 []"><div><p>test<br>* 1</p></div></div>',
    });
    await expect(editor).toHaveDocument(
      doc(
        panel({
          panelColor: null,
          panelIcon: null,
          panelIconId: null,
          panelIconText: null,
          panelType: 'info',
        })(p('test'), ul(li(p('1')))),
      ),
    );
  });
});

test.describe('paste: libra - text color', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTextColor: true,
    },
  });
  test('paste tests on fullpage editor: text formatting', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: '<strong>bold </strong><em><strong>italics and bold </strong>some italics only </em><span class="code" style="font-family: monospace; white-space: pre-wrap;">add some code to this </span><u>underline this text</u><s> strikethrough </s><span style="color: rgb(0, 184, 217);">blue is my fav color</span> <a href="http://www.google.com">www.google.com</a>',
    });
    await expect(editor).toHaveDocument(
      doc(
        p(
          strong('bold '),
          strong(em('italics and bold ')),
          em('some italics only '),
          code('add some code to this '),
          underline('underline this text'),
          strike(' strikethrough '),
          textColor({ color: '#00b8d9' })('blue is my fav color'),
          ' ',
          a({ href: 'http://www.google.com' })('www.google.com'),
        ),
      ),
    );
  });
});

test.describe('paste: libra - smart cards', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowBlockCards: true,
      },
    },
  });
  test('inline card copied from renderer and pasted', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">This is an inline card<a data-inline-card="" href="https://www.google.com" data-card-data="">https://www.google.com</a>. This is end of sentence.</p>`,
    });
    await expect(editor).toHaveDocument(
      doc(
        p(
          'This is an inline card',
          inlineCard({ url: 'https://www.google.com' })(),
          '. This is end of sentence.',
        ),
      ),
    );
  });
});

test.describe('paste: libra - media inline', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        featureFlags: {
          mediaInline: true,
        },
      },
    },
  });
  test('media inline card copied from renderer and pasted', async ({
    editor,
  }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">This is an media inline card<span data-height="100" data-width="100" data-id="a559980d-cd47-43e2-8377-27359fcb905f" data-node-type="mediaInline" data-type="file" data-collection="MediaServicesSample" data-alt="" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-context-id="DUMMY-OBJECT-ID"></span></p><h3>h3</h3>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        p(
          'This is an media inline card',
          mediaInline({
            __contextId: 'DUMMY-OBJECT-ID',
            __displayType: null,
            __external: false,
            __fileMimeType: 'image/jpeg',
            __fileName: 'tall_image.jpeg',
            __fileSize: 58705,
            __mediaTraceId: expect.any(String),
            alt: '',
            collection: 'MediaServicesSample',
            height: 100,
            id: expect.any(String),
            type: 'file',
            width: 100,
          })(),
        ),
        h3('h3'),
      ),
    );
  });
});

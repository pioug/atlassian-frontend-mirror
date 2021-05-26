import {
  a,
  blockquote,
  br,
  code,
  code_block,
  doc,
  em,
  emoji,
  img,
  li,
  media,
  mediaSingle,
  mention,
  ol,
  p,
  strike,
  strong,
  subsup,
  typeAheadQuery,
  ul,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

import { MarkdownSerializer, marks, nodes } from '../../serializer';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('SlackTransformer: serializer', () => {
  const pre = code_block();

  it('should serialize paragraphs', () => {
    expect(markdownSerializer.serialize(doc(p('foo'))(defaultSchema))).toEqual(
      'foo',
    );
    expect(
      markdownSerializer.serialize(doc(p('foo'), p('bar'))(defaultSchema)),
    ).toEqual('foo\n\nbar');

    const longText = 'foo '.repeat(100);
    expect(
      markdownSerializer.serialize(
        doc(p(longText), p(longText))(defaultSchema),
      ),
    ).toEqual(`${longText}\n\n${longText}`);
  });

  it('should preserve multiple blank lines using zero-non-width', () => {
    expect(
      markdownSerializer.serialize(doc(p('foo'), p(), p('bar'))(defaultSchema)),
    ).toEqual('foo\n\n\u200c\n\nbar');

    expect(
      markdownSerializer.serialize(
        doc(p('foo'), p(), p(), p('bar'))(defaultSchema),
      ),
    ).toEqual('foo\n\n\u200c\n\n\u200c\n\nbar');
  });

  it('should preserve leading and trailing blank lines using zero-non-width', () => {
    expect(
      markdownSerializer.serialize(doc(p(), p('bar'))(defaultSchema)),
    ).toEqual('\u200c\n\nbar');

    expect(
      markdownSerializer.serialize(doc(p(), p(), p('bar'))(defaultSchema)),
    ).toEqual('\u200c\n\n\u200c\n\nbar');

    expect(
      markdownSerializer.serialize(doc(p('foo'), p())(defaultSchema)),
    ).toEqual('foo\n\n\u200c');

    expect(
      markdownSerializer.serialize(doc(p('foo'), p(), p())(defaultSchema)),
    ).toEqual('foo\n\n\u200c\n\n\u200c');
  });

  it('should not escape lone pipe characters', () => {
    expect(
      markdownSerializer.serialize(doc(p(` | | `))(defaultSchema)),
    ).toEqual(` | | `);
  });

  describe('mentions', () => {
    it('should serialize mentions', () => {
      const node = doc(
        p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })()),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@rsynenko');
    });

    it('should divide serialized mentions and text with one blank space', () => {
      const node = doc(
        p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), 'text'),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@rsynenko text');
    });

    it('should not add a blank space in the end of the string for mentions', () => {
      const node = doc(
        p('text ', mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })()),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('text @rsynenko');
    });

    it('should not divide mention and text with additional space if text starts with the space', () => {
      const node = doc(
        p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), ' text'),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@rsynenko text');
    });

    it('should divide mention and text with only one additional space if text starts with the spaces', () => {
      const node = doc(
        p(mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(), '  text'),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@rsynenko  text');
    });

    it('should not divide mention and italic text node with additional space if text starts with the space', () => {
      const node = doc(
        p(
          mention({ text: 'Rostyslav Synenko', id: 'rsynenko' })(),
          em(' text'),
        ),
      )(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@rsynenko _text_');
    });
  });

  describe('emoji', () => {
    it('should serialize emoji', () => {
      const node = doc(p(emoji({ shortName: ':grinning:' })()))(defaultSchema);
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual(':grinning:');
    });
  });

  describe('code block', () => {
    it('with simple text should be serialized', () => {
      expect(
        markdownSerializer.serialize(doc(pre('foo'))(defaultSchema)),
      ).toEqual('```\nfoo\n```');
    });

    it('with newlines preserves newlines in markdown', () => {
      expect(
        markdownSerializer.serialize(doc(pre('foo\nbar'))(defaultSchema)),
      ).toEqual('```\nfoo\nbar\n```');
    });

    it('with adjacent code block keeps empty space between', () => {
      expect(
        markdownSerializer.serialize(
          doc(pre('foo'), pre('bar'))(defaultSchema),
        ),
      ).toEqual('```\nfoo\n```\n\n```\nbar\n```');
    });

    it('after a list should not disappear', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('para'))), pre('hello'))(defaultSchema),
        ),
      ).toEqual('• para\n\n```\nhello\n```');
    });

    it('with attributes uses backtick notation and does not preserve attributes', () => {
      const js = code_block({ language: 'js' });
      expect(
        markdownSerializer.serialize(doc(js('foo'))(defaultSchema)),
      ).toEqual('```\nfoo\n```');

      expect(
        markdownSerializer.serialize(doc(js('foo\nbar'))(defaultSchema)),
      ).toEqual('```\nfoo\nbar\n```');
    });

    it('with no text is preserved', () => {
      expect(markdownSerializer.serialize(doc(pre(''))(defaultSchema))).toEqual(
        '```\n\u200c\n```',
      );

      expect(markdownSerializer.serialize(doc(pre())(defaultSchema))).toEqual(
        '```\n\u200c\n```',
      );
    });
  });

  describe('bullet list', () => {
    it('with elements should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('foo')), li(p('bar')), li(p('baz'))))(defaultSchema),
        ),
      ).toEqual('• foo\n• bar\n• baz\n\n');
    });

    it('surrounded with other block elements keeps empty line between', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            p('para'),
            ul(li(p('foo')), li(p('bar'))),
            p('baz'),
          )(defaultSchema),
        ),
      ).toEqual('para\n\n• foo\n• bar\n\nbaz');
    });

    it('with one empty element is preserved', () => {
      expect(
        markdownSerializer.serialize(doc(ul(li(p(''))))(defaultSchema)),
      ).toEqual('• \n\n');
    });

    it('with nesting should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ul(
              li(
                p('foo 1'),
                ul(
                  li(p('bar 1'), ul(li(p('baz 1')), li(p('baz 2')))),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '• foo 1\n' +
          '\n' +
          '    • bar 1\n' +
          '    \n' +
          '        • baz 1\n' +
          '        • baz 2\n' +
          '        \n' +
          '    • bar 2\n' +
          '    \n' +
          '• foo 2\n' +
          '\n',
      );
    });

    it('with newline', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('item 1'), p('\n')), li(p('item 2'))))(defaultSchema),
        ),
      ).toEqual(
        '• item 1\n' +
          '\n' +
          '    \n' +
          '    \n' +
          '\n' +
          '\n' +
          '• item 2\n' +
          '\n',
      );
    });

    it('with list item containing two lines', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('item 1'), p('item 1 desc')), li(p('item 2'))))(
            defaultSchema,
          ),
        ),
      ).toEqual(
        '• item 1\n' +
          '\n' +
          '    item 1 desc\n' +
          '\n' +
          '\n' +
          '• item 2\n' +
          '\n',
      );
    });
  });

  describe('ordered list', () => {
    it('with elements should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(ol(li(p('foo')), li(p('bar')), li(p('baz'))))(defaultSchema),
        ),
      ).toEqual('1. foo\n2. bar\n3. baz\n\n');
    });

    it('surrounded with other block elements keeps empty line between', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            p('para'),
            ol(li(p('foo')), li(p('bar'))),
            p('baz'),
          )(defaultSchema),
        ),
      ).toEqual('para\n\n1. foo\n2. bar\n\nbaz');
    });

    it('with 10+ elements aligns numbers to right', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '1. item\n2. item\n3. item\n4. item\n5. item\n6. item\n7. item\n8. item\n9. item\n10. item\n\n',
      );
    });

    it('with one empty element is preserved', () => {
      expect(
        markdownSerializer.serialize(doc(ol(li(p(''))))(defaultSchema)),
      ).toEqual('1. \n\n');
    });

    it('with nesting should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(
                p('foo 1'),
                ol(
                  li(p('bar 1'), ol(li(p('baz 1')), li(p('baz 2')))),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '\n' +
          '    1. bar 1\n' +
          '    \n' +
          '        1. baz 1\n' +
          '        2. baz 2\n' +
          '        \n' +
          '    2. bar 2\n' +
          '    \n' +
          '2. foo 2\n' +
          '\n',
      );
    });
  });

  describe('mixed lists', () => {
    it('of nested ordered and unordered should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(
                p('foo 1'),
                ul(
                  li(
                    p('bar 1'),
                    ol(li(p('baz 1')), li(p('baz 2'), ul(li(p('banana'))))),
                  ),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '\n' +
          '    • bar 1\n' +
          '    \n' +
          '        1. baz 1\n' +
          '        2. baz 2\n' +
          '        \n' +
          '            • banana\n' +
          '            \n' +
          '        \n' +
          '    • bar 2\n' +
          '    \n' +
          '2. foo 2\n' +
          '\n',
      );
    });

    it('of consecutive ordered and unordered should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(li(p('foo 1')), li(p('foo 2'))),
            ul(li(p('bar 1')), li(p('bar 2'))),
            ol(li(p('baz 1')), li(p('baz 2'))),
          )(defaultSchema),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '2. foo 2\n' +
          '\n' +
          '• bar 1\n' +
          '• bar 2\n' +
          '\n' +
          '1. baz 1\n' +
          '2. baz 2\n' +
          '\n',
      );
    });
  });

  it('should serialize hardBreak to newline', () => {
    expect(
      markdownSerializer.serialize(doc(p('foo ', br(), 'bar'))(defaultSchema)),
    ).toEqual('foo   \nbar');
  });

  describe('image', () => {
    it('should serialize img', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            p(
              img({
                src: 'http://example.com',
              })(),
            ),
          )(defaultSchema),
        ),
      ).toEqual('[<http://example.com|image attached>]');
    });
  });

  describe('external media', () => {
    it('should be serialized', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            mediaSingle()(
              media({ url: 'http://path/to/image.jpg', type: 'external' })(),
            ),
          )(defaultSchema),
        ),
      ).toEqual('[<http://path/to/image.jpg|media attached>]\n');
    });
  });

  describe('blockquotes', () => {
    it('should serialized', () => {
      expect(
        markdownSerializer.serialize(doc(blockquote(p('foo')))(defaultSchema)),
      ).toEqual('> foo');
      expect(
        markdownSerializer.serialize(
          doc(blockquote(p('foo')), blockquote(p('bar')))(defaultSchema),
        ),
      ).toEqual('> foo\n\n> bar');
    });
  });

  describe('marks -', () => {
    it('should ignore typeAheadQuery mark', () => {
      expect(
        markdownSerializer.serialize(
          doc(p(typeAheadQuery({ trigger: '@' })('@rsynenko')))(defaultSchema),
        ),
      ).toEqual('@rsynenko');
    });

    /**
     * Slack markdown does not have specific syntax for (sub|super)script, underline.
     */
    it('should serialize superscript as default text', () => {
      expect(
        markdownSerializer.serialize(
          doc(p(subsup({ type: 'sup' })('superscript')))(defaultSchema),
        ),
      ).toEqual('superscript');
    });

    it('should serialize subscript as default text', () => {
      expect(
        markdownSerializer.serialize(
          doc(p(subsup({ type: 'sup' })('subscript')))(defaultSchema),
        ),
      ).toEqual('subscript');
    });

    it('should serialize underline as default text', () => {
      expect(
        markdownSerializer.serialize(
          doc(p(underline('underline')))(defaultSchema),
        ),
      ).toEqual('underline');
    });

    it('should serialize em', () => {
      expect(
        markdownSerializer.serialize(doc(p(em('foo')))(defaultSchema)),
      ).toEqual('_foo_');
      expect(
        markdownSerializer.serialize(
          doc(p('foo ', em('bar'), ' baz'))(defaultSchema),
        ),
      ).toEqual('foo _bar_ baz');
    });

    it('should serialize strong', () => {
      expect(
        markdownSerializer.serialize(doc(p(strong('foo')))(defaultSchema)),
      ).toEqual('*foo*');
      expect(
        markdownSerializer.serialize(
          doc(p('foo ', strong('bar bar'), ' baz'))(defaultSchema),
        ),
      ).toEqual('foo *bar bar* baz');
    });

    it('should serialize strikethrough', () => {
      expect(
        markdownSerializer.serialize(doc(p(strike('foo')))(defaultSchema)),
      ).toEqual('~foo~');
      expect(
        markdownSerializer.serialize(
          doc(p('foo ', strike('bar bar'), ' baz'))(defaultSchema),
        ),
      ).toEqual('foo ~bar bar~ baz');
    });

    it('should serialize code', () => {
      expect(
        markdownSerializer.serialize(doc(p(code('foo')))(defaultSchema)),
      ).toEqual('`foo`');
      expect(
        markdownSerializer.serialize(
          doc(p('foo ', code('bar baz'), ' foo'))(defaultSchema),
        ),
      ).toEqual('foo `bar baz` foo');
    });

    describe('code', () => {
      it('should convert code', () => {
        expect(
          markdownSerializer.serialize(
            doc(p('foo ', code('bar ` ` baz'), ' foo'))(defaultSchema),
          ),
        ).toEqual('foo `bar ` ` baz` foo');
      });
    });

    describe('links', () => {
      it('with no text to be ignored', () => {
        const link = a({ href: 'http://example.com' });

        expect(
          markdownSerializer.serialize(doc(p(link('')))(defaultSchema)),
        ).toEqual('');
      });

      it('with no title to serialize', () => {
        const link = a({ href: 'http://example.com' });

        expect(
          markdownSerializer.serialize(doc(p(link('foo')))(defaultSchema)),
        ).toEqual('<http://example.com|foo>');
      });
    });

    describe('emphasis -', () => {
      it('asterisk within strings should be escaped', () => {
        expect(
          markdownSerializer.serialize(doc(p('*foo bar*'))(defaultSchema)),
        ).toEqual('\\*foo bar\\*');

        expect(
          markdownSerializer.serialize(doc(p('**foo bar**'))(defaultSchema)),
        ).toEqual('\\*\\*foo bar\\*\\*');

        expect(
          markdownSerializer.serialize(doc(p('***foo bar***'))(defaultSchema)),
        ).toEqual('\\*\\*\\*foo bar\\*\\*\\*');
      });

      it('underscore within strings should be escaped', () => {
        expect(
          markdownSerializer.serialize(doc(p('_foo bar_'))(defaultSchema)),
        ).toEqual('\\_foo bar\\_');

        expect(
          markdownSerializer.serialize(doc(p('__foo bar__'))(defaultSchema)),
        ).toEqual('\\_\\_foo bar\\_\\_');

        expect(
          markdownSerializer.serialize(doc(p('___foo bar___'))(defaultSchema)),
        ).toEqual('\\_\\_\\_foo bar\\_\\_\\_');
      });

      it('"strong em" should be escaped in its entirety', () => {
        expect(
          markdownSerializer.serialize(doc(p('*strong*em*'))(defaultSchema)),
        ).toEqual('\\*strong\\*em\\*');
      });

      it('"smart em" should be escaped in its entirety', () => {
        expect(
          markdownSerializer.serialize(
            doc(p('_smart_emphasis_'))(defaultSchema),
          ),
        ).toEqual('\\_smart\\_emphasis\\_');
      });

      it('should handle strong/em/strikethrough being next to each other', () => {
        expect(
          markdownSerializer.serialize(
            doc(p(strike('hello, '), em(' how are'), strong(' you')))(
              defaultSchema,
            ),
          ),
        ).toEqual('~hello,~  _how are_ *you*');
      });

      it('combinations should be properly serialized', () => {
        expect(
          markdownSerializer.serialize(
            doc(p(em('hi'), '*there*'))(defaultSchema),
          ),
        ).toEqual('_hi_\\*there\\*');

        expect(
          markdownSerializer.serialize(
            doc(p(strike(strong('foo bar baz'))))(defaultSchema),
          ),
        ).toEqual('*~foo bar baz~*');

        expect(
          markdownSerializer.serialize(
            doc(p(strong(strike('foo bar'), ' baz')))(defaultSchema),
          ),
        ).toEqual('*~foo bar~ baz*');

        expect(
          markdownSerializer.serialize(
            doc(p(em(strike('foo bar'), ' baz')))(defaultSchema),
          ),
        ).toEqual('_~foo bar~ baz_');

        expect(
          markdownSerializer.serialize(
            doc(p(code('*bar baz*')))(defaultSchema),
          ),
        ).toEqual('`*bar baz*`');

        expect(
          markdownSerializer.serialize(
            doc(p(code('__bar_baz__')))(defaultSchema),
          ),
        ).toEqual('`__bar_baz__`');
      });
    });

    describe('tilde ~', () => {
      it('should escape tilde ~', () => {
        expect(
          markdownSerializer.serialize(doc(p('~'))(defaultSchema)),
        ).toEqual('\\~');
      });
    });
  });

  describe('New lines', () => {
    it('should serialize new line - 1', () => {
      expect(
        markdownSerializer.serialize(doc(p('foo\nbar'))(defaultSchema)),
      ).toEqual('foo\nbar');
    });

    it('should serialize new line - 2', () => {
      expect(
        markdownSerializer.serialize(doc(p('foo\nbar'))(defaultSchema)),
      ).toEqual('foo\nbar');
    });

    it('should serialize new line - 3', () => {
      expect(
        markdownSerializer.serialize(
          doc(p('pagh\nwa’\ncha’\nwej\nloS\nvagh\njav\nSoch\nchorgh\nHut\n'))(
            defaultSchema,
          ),
        ),
      ).toEqual('pagh\nwa’\ncha’\nwej\nloS\nvagh\njav\nSoch\nchorgh\nHut\n');
    });
  });
});

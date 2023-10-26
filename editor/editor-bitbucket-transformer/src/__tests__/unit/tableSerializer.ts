import { MarkdownSerializer, marks, nodes } from '../../serializer';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
  p,
  table,
  tr,
  th,
  td,
  doc,
  strong,
  ol,
  li,
  code_block,
  code,
  blockquote,
  ul,
  mention,
} from '@atlaskit/editor-test-helpers/doc-builder';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('BitbucketTransformer: serializer', () => {
  describe('tables', () => {
    it('should serialized', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(td({})(p('c11')), td({})(p('c12')), td({})(p('c13'))),
            tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
          )(defaultSchema),
        ),
      ).toBeDefined();
    });

    it('should serialized table correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(td({})(p('c11')), td({})(p('c12')), td({})(p('c13'))),
            tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| c11 | c12 | c13 |\n| c21 | c22 | c23 |\n',
      );
    });

    it('should serialized table correctly when in middle of other blocks', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            p('before'),
            table()(
              tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
              tr(td({})(p('c11')), td({})(p('c12')), td({})(p('c13'))),
              tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
            ),
            p('after'),
          )(defaultSchema),
        ),
      ).toEqual(
        'before\n\n| h1 | h2 | h3 |\n| --- | --- | --- |\n| c11 | c12 | c13 |\n| c21 | c22 | c23 |\n\nafter',
      );
    });

    it('should serialized even if there is only header row', () => {
      expect(
        markdownSerializer.serialize(
          table()(tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))))(
            defaultSchema,
          ),
        ),
      ).toEqual('| h1 | h2 | h3 |\n| --- | --- | --- |\n');
    });

    it('should serialized even header and cells are empty', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p()), th({})(p()), th({})(p())),
            tr(td({})(p()), td({})(p()), td({})(p())),
          )(defaultSchema),
        ),
      ).toEqual('|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n');
    });

    it('should escape pipe character in the cells', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1 | H1')), th({})(p('h2')), th({})(p('h3'))),
            tr(td({})(p('c11 | C11')), td({})(p('c12')), td({})(p('c13'))),
            tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 \\| H1 | h2 | h3 |\n| --- | --- | --- |\n| c11 \\| C11 | c12 | c13 |\n| c21 | c22 | c23 |\n',
      );
    });

    it('should preserve inline marks', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1', strong('HH'))), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(p('c11', strong('CC'))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1**HH** | h2 | h3 |\n| --- | --- | --- |\n| c11**CC** | c12 | c13 |\n',
      );
    });

    it('should preserve mentions correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(p('c11', mention({ text: 'Testy', id: 'test' })())),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| c11@{test} | c12 | c13 |\n',
      );
    });

    it('should preserve inline code correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(p('c11', code('test'))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| c11`test` | c12 | c13 |\n',
      );
    });

    it('should preserve codeblocks correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(code_block({ language: 'js' })('const example = 1')),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| ```js\nconst example = 1\n```\n\n | c12 | c13 |\n',
      );
    });

    it('should preserve single line block quotes correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(blockquote(p('I am a highly quotable person'))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| > I am a highly quotable person\n\n | c12 | c13 |\n',
      );
    });

    it('should preserve multiple line block quotes correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(
                blockquote(
                  p('I am a highly quotable person'),
                  p('And I ramble on a lot'),
                ),
              ),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| > I am a highly quotable person\n>\n> And I ramble on a lot\n\n | c12 | c13 |\n',
      );
    });

    it('should preserve bulleted lists with one item correctly', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(ul(li(p('I am an unordered person')))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| * I am an unordered person\n\n | c12 | c13 |\n',
      );
    });

    it('should preserve lists with nesting', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(
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
              ),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| ' +
          '* foo 1\n' +
          '\n' +
          '    * bar 1\n' +
          '    \n' +
          '        * baz 1\n' +
          '        * baz 2\n' +
          '        \n' +
          '    * bar 2\n' +
          '    \n' +
          '* foo 2\n' +
          '\n' +
          ' | c12 | c13 |\n',
      );
    });

    it('should separate content of multiple blocks with space', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(p('c111'), p('c112')),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| c111 c112 | c12 | c13 |\n',
      );
    });

    it('should preserve ordered lists', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(ol()(li(p('l1')), li(p('l2')))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| 1. l1\n2. l2\n\n | c12 | c13 |\n',
      );
    });

    it('should not produce markdown if table has no header', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            table()(
              tr(td({})(p('c11')), td({})(p('c12')), td({})(p('c13'))),
              tr(td({})(p('c21')), td({})(p('c22')), td({})(p('c23'))),
            ),
          )(defaultSchema),
        ),
      ).toEqual('');
    });
  });
});

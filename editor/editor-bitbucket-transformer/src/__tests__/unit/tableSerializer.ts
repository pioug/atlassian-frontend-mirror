import { MarkdownSerializer, marks, nodes } from '../../serializer';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  p,
  table,
  tr,
  th,
  td,
  doc,
  strong,
  mention,
  ol,
  li,
} from '@atlaskit/editor-test-helpers';

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
              td({})(
                p('c11', mention({ text: 'Testing Testing', id: 'test' })()),
              ),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| c11@test | c12 | c13 |\n',
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

    it('should separate content of list with space', () => {
      expect(
        markdownSerializer.serialize(
          table()(
            tr(th({})(p('h1')), th({})(p('h2')), th({})(p('h3'))),
            tr(
              td({})(ol(li(p('l1')), li(p('l2')))),
              td({})(p('c12')),
              td({})(p('c13')),
            ),
          )(defaultSchema),
        ),
      ).toEqual(
        '| h1 | h2 | h3 |\n| --- | --- | --- |\n| l1 l2 | c12 | c13 |\n',
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

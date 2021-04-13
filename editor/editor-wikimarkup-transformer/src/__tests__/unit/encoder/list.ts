import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  li,
  ol,
  p,
  ul,
  code_block,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - List', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert bulletList node', () => {
    const node = doc(ul(li(p('item 1')), li(p('item 2'))))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert listItem with multiple paragraph', () => {
    const node = doc(ul(li(p('item 1A'), p('item 1B')), li(p('item 2'))))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert orderedList node', () => {
    const node = doc(ol(li(p('item 1')), li(p('item 2'))))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert nested orderedList inside bulletList', () => {
    const node = doc(
      ul(
        li(p('item 1'), ol(li(p('innner item 1')), li(p('innner item 2')))),
        li(p('item 2')),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert nested bulletList inside orderedList', () => {
    const node = doc(
      ol(
        li(p('item 1'), ul(li(p('innner item 1')), li(p('innner item 2')))),
        li(p('item 2')),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert codeblock node', () => {
    const node = doc(
      ul(
        li(p('item 1')),
        li(p('item 2'), code_block({ language: 'javascript' })('const i = 0;')),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mediaSingle node', () => {
    const node = doc(
      ul(
        li(p('item 1')),
        li(
          p('item 2'),
          mediaSingle()(
            media({
              id: 'abc-123',
              type: 'file',
              collection: 'tmp',
              width: 100,
              height: 100,
            })(),
          ),
        ),
      ),
    )(defaultSchema);
    expect(
      transformer.encode(node, {
        conversion: {
          mediaConversion: {
            'abc-123': { transform: 'file1.txt', embed: true },
          },
        },
      }),
    ).toMatchSnapshot();
  });
});

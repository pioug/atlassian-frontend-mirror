import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
  table,
  tr,
  td,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Context } from '../../../interfaces';

describe('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer();
  const context: Context = {
    conversion: {
      mediaConversion: {
        'abc-123': { transform: 'file1.txt', embed: true },
        'def-456': { transform: 'file2.txt', embed: true },
      },
    },
  };

  test('should convert mediaGroup node', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'abc-123', type: 'file', collection: 'tmp' })(),
        media({ id: 'def-456', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert mediaSingle node with no width and height to thumbnail', () => {
    const node = doc(
      mediaSingle()(
        media({ id: 'abc-123', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert mediaSingle depending on context', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'embedded', type: 'file', collection: 'tmp' })(),
        media({ id: 'not-embedded', type: 'file', collection: 'tmp' })(),
        media({ id: 'default-embedded', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    const context: Context = {
      conversion: {
        mediaConversion: {
          embedded: { transform: 'embedded-output', embed: true },
          'not-embedded': { transform: 'not-embedded-output', embed: false },
          'default-embedded': { transform: 'default-embedded-output' },
        },
      },
    };
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert mediaSingle with context inside table', () => {
    const node = doc(
      table()(
        tr(
          td()(
            mediaSingle()(
              media({ id: 'adf-media-id', type: 'file', collection: 'tmp' })(),
            ),
          ),
        ),
      ),
    )(defaultSchema);
    const context: Context = {
      conversion: {
        mediaConversion: {
          'adf-media-id': { transform: 'wiki-media-id', embed: true },
        },
      },
    };
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert mediaSingle node with width and height', () => {
    const node = doc(
      mediaSingle()(
        media({
          id: 'abc-123',
          type: 'file',
          collection: 'tmp',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert external image', () => {
    const node = doc(
      mediaSingle()(
        media({
          url: 'https://www.atlassian.com/nice.jpg',
          type: 'external',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert media with no context', () => {
    const node = doc(
      mediaSingle()(
        media({
          id: 'abc-123-uuid',
          type: 'file',
          collection: 'tmp',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mediaSingle with percentual width', () => {
    const node = doc(
      mediaSingle({
        width: 50,
        layout: 'center',
      })(
        media({
          id: 'abc-123-uuid',
          type: 'file',
          collection: 'tmp',
          width: 100,
          height: 100,
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert media with alt text', () => {
    const node = doc(
      mediaSingle()(
        media({
          id: 'abc-123-uuid',
          type: 'file',
          collection: 'tmp',
          width: 100,
          height: 100,
          alt: 'Helo world',
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert media with image links', () => {
    const node = doc(
      mediaSingle()(
        a({ href: 'google.com' })(
          media({
            id: 'abc-123-uuid',
            type: 'file',
            collection: 'tmp',
            width: 100,
            height: 100,
            alt: 'Helo world',
          })(),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
} from '@atlaskit/editor-test-helpers';
import { Context } from '../../../interfaces';

describe('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer();
  const context: Context = {
    conversion: {
      mediaConversion: {
        'abc-123': 'file1.txt',
        'def-456': 'file2.txt',
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
});

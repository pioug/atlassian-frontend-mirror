import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, mention, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { Context } from '../../../interfaces';

describe('ADF => WikiMarkup - Mention', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert mention node', () => {
    const node = doc(
      p(
        'Hey ',
        mention({ id: 'supertong' })(),
        ', please take a look at this.',
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mention node with context', () => {
    const context: Context = {
      conversion: {
        mentionConversion: {
          'abc-123': 'randomPrefix:abc-123',
        },
      },
    };
    const node = doc(
      p('Hey ', mention({ id: 'abc-123' })(), ', please take a look at this.'),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert mention node with context case-insensitively', () => {
    const context: Context = {
      conversion: {
        mentionConversion: {
          AAAaaa: 'accountId:bbbbbb',
        },
      },
    };
    const node = doc(
      p('Hey ', mention({ id: 'aaaAAA' })(), ', please take a look at this.'),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('should convert unknown mention', () => {
    const context: Context = {};
    const node = doc(
      p(
        'Hey ',
        mention({ id: 'UNKNOWN_USER' })(),
        ', please take a look at this.',
      ),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });

  test('[CS-1896] should convert empty mention node to [~accountid:]', () => {
    const context: Context = {};
    const node = doc(
      p('Hey ', mention({ id: '' })(), ', you have no accountid.'),
    )(defaultSchema);
    expect(transformer.encode(node, context)).toMatchSnapshot();
  });
});

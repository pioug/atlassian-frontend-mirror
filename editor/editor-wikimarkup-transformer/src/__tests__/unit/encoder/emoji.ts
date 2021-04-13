import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Emoji', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert emoji node', () => {
    const node = doc(
      p('Hello ', emoji({ id: '1f603', shortName: ':smiley:', text: '😃' })()),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert custom emoji node', () => {
    const node = doc(
      p(
        'Hello ',
        emoji({ id: '1234567890', shortName: ':partying_face:', text: '😃' })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

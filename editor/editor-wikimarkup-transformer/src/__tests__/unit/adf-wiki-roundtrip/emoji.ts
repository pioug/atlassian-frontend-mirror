import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF - Emoji', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert emoji node', () => {
    /**
     * It is expected that emoji will be converted to unicode emoji
     * and won't be converted back to emoji node
     */
    const node = doc(
      p('Hello ', emoji({ id: '1f603', shortName: ':smiley:', text: '😃' })()),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello 😃',
            },
          ],
        },
      ],
    });
  });
});

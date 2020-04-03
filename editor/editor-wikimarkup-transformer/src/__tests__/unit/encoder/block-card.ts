import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, blockCard } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - BlockCard', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert blockcard node', () => {
    const node = doc(blockCard({ url: 'https://www.dropbox.com' })())(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

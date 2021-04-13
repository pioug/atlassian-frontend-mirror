import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, embedCard } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - embedCard', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert smart-embed node', () => {
    const node = doc(
      embedCard({ url: 'https://www.dropbox.com', layout: 'center' })(),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

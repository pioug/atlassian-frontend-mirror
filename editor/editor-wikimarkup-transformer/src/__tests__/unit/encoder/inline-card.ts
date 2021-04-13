import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Inline Card', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert inline-card', () => {
    const node = doc(
      p(
        'this is an inline-card ',
        inlineCard({
          url: 'https://product-fabric.atlassian.net/browse/EX-522#icft=EX-522',
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert inline-card that is not an issue link', () => {
    const node = doc(
      p(
        'this is an dropbox inline card ',
        inlineCard({
          url:
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
        })(),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

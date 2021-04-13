import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF - Inline Card', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert inlineCard node', () => {
    const node = doc(
      p(
        inlineCard({
          url: 'https://product-fabric.atlassian.net/browse/EX-522#icft=EX-522',
        })(),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const context: any = {
      conversion: {
        inlineCardConversion: {
          'EX-522': 'https://product-fabric.atlassian.net/browse/EX-522',
        },
      },
    };
    const adf = transformer.parse(wiki, context).toJSON();

    expect(adf).toEqual(node.toJSON());
  });
});

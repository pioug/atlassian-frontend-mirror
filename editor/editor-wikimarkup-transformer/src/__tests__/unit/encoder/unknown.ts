import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Unknown Nodes', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert custom emoji into {adf}', () => {
    const node = doc(
      p('Hello ', emoji({ id: 'wtf', shortName: ':wtf:', text: ':wtf:' })()),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

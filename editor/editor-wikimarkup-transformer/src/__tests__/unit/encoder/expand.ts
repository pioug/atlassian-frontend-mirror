import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, p, expand } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Expand', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert expand node', () => {
    const node = doc(expand({ title: 'Title' })(p('helloooooo')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, date, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Dates', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert date node with format YYYY-MM-DD', () => {
    const node = doc(
      p(
        'Dec 04 1995 is ',
        date({
          timestamp: '818035920000',
        }),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

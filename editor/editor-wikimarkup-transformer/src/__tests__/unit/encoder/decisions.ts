import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Decision', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert decision list into bullet list', () => {
    const node = doc(
      decisionList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
        decisionItem({
          localId: '0e87110e-aa58-411a-964b-883942b118cc',
          state: 'DECIDED',
        })('this is an decision'),
        decisionItem({
          localId: '0e87110e-aa58-411a-964b-883942b118cc',
          state: 'DECIDED',
        })('this is an another decision'),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  blockquote,
  doc,
  hardBreak,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - BlockQuote', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert blockquote node', () => {
    const node = doc(
      blockquote(
        p('This is a blockquote'),
        p('and it can only contain paragraphs'),
        p('a lot paragraphs'),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert blockquote node with a single paragraph with hardbreak', () => {
    const node = doc(
      blockquote(
        p(
          'This is a blockquote',
          hardBreak(),
          'with a single paragraph',
          hardBreak(),
          'and hardbreaks',
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

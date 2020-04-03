import { defaultSchema } from '@atlaskit/adf-schema';
import { adf2wiki } from '../_test-helpers';

import { blockquote, doc, hardBreak, p } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - BlockQuote', () => {
  test('should convert blockquote node', () => {
    adf2wiki(
      doc(
        blockquote(
          p('This is a blockquote'),
          p('and it can only contain paragraphs'),
          p('a lot paragraphs'),
        ),
      )(defaultSchema),
    );
  });

  test('should convert blockquote node with a single paragraph with hardbreak', () => {
    adf2wiki(
      doc(
        blockquote(
          p(
            'This is a blockquote',
            hardBreak(),
            'with a single paragraph',
            hardBreak(),
            'and hardbreaks',
          ),
        ),
      )(defaultSchema),
    );
  });
});

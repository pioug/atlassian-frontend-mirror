import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { code_block, doc } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - CodeBlock', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert codeBlock node', () => {
    const node = doc(code_block({ language: 'javascript' })('const i = 0;'))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert codeBlock node with no language specified', () => {
    const node = doc(code_block()('const i = 0;'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert codeBlock node with unsupported language specified', () => {
    const node = doc(code_block({ language: 'xxx' })('const i = 0;'))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('[CS-293] should not escape formatter charaters in wiki', () => {
    const node = doc(
      code_block({ language: 'xxx' })(
        'This will not escape [~mention] !file.txt! and {macro}',
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Heading', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert level 1 heading', () => {
    const node = doc(h1('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('It should convert level 2 heading', () => {
    const node = doc(h2('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert level 3 heading', () => {
    const node = doc(h3('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert level 4 heading', () => {
    const node = doc(h4('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert level 5 heading', () => {
    const node = doc(h5('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert level 6 heading', () => {
    const node = doc(h6('some plain text'))(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

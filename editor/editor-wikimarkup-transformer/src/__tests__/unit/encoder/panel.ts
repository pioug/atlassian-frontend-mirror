import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  h1,
  li,
  p,
  panel,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Panel', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert info panel node', () => {
    const node = doc(panel({ panelType: 'info' })(p('This is a info panel')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert note panel node', () => {
    const node = doc(panel({ panelType: 'note' })(p('This is a note panel')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert success panel node', () => {
    const node = doc(
      panel({ panelType: 'success' })(p('This is a success panel')),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert error panel node', () => {
    const node = doc(panel({ panelType: 'error' })(p('This is a error panel')))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert warning panel node', () => {
    const node = doc(
      panel({ panelType: 'warning' })(p('This is a warning panel')),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert heading inside panel node', () => {
    const node = doc(
      panel({ panelType: 'warning' })(h1('This is a warning panel')),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert list inside panel node', () => {
    const node = doc(
      panel({ panelType: 'warning' })(ul(li(p('item 1')), li(p('item 2')))),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert mixed content panel node', () => {
    const node = doc(
      panel({ panelType: 'warning' })(
        h1('This is a list'),
        ul(li(p('item 1')), li(p('item 2'))),
        p('that is all'),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  code_block,
  doc,
  h1,
  h2,
  h3,
  h4,
  hr,
  li,
  ol,
  p,
  panel,
  table,
  td,
  th,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Table', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert Table node', () => {
    const node = doc(
      table()(
        tr(th()(p('Header 1')), th()(p('Header 2'))),
        tr(td()(p('Cell 1')), td()(p('Cell 2'))),
        tr(td()(p('Cell 3')), td()(p('Cell 4'))),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node without a header row', () => {
    const node = doc(
      table()(
        tr(td()(p('Cell 1')), td()(p('Cell 2'))),
        tr(td()(p('Cell 3')), td()(p('Cell 4'))),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node with panel in the cell', () => {
    const node = doc(
      table()(
        tr(
          td()(panel({ panelType: 'note' })(p('This is a note panel'))),
          td()(panel({ panelType: 'info' })(p('This is a info panel'))),
        ),
        tr(
          td()(panel({ panelType: 'success' })(p('This is a success panel'))),
          td()(panel({ panelType: 'warning' })(p('This is a warning panel'))),
          td()(panel({ panelType: 'error' })(p('This is a error panel'))),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node with list in the cell', () => {
    const node = doc(
      table()(
        tr(
          td()(ul(li(p('item 1')), li(p('item 2')))),
          td()(ol(li(p('item 1')), li(p('item 2')))),
        ),
        tr(
          td()(ol(li(p('item 1')), li(p('item 2')))),
          td()(ul(li(p('item 1')), li(p('item 2')))),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node with list and paragraph in the cell', () => {
    const node = doc(
      table()(
        tr(
          td()(ul(li(p('item 1')), li(p('item 2'))), p('below the list')),
          td()(ol(li(p('item 1')), li(p('item 2'))), p('below the list')),
        ),
        tr(
          td()(ol(li(p('item 1')), li(p('item 2'))), p('below the list')),
          td()(ul(li(p('item 1')), li(p('item 2'))), p('below the list')),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node with ruler and heading in the cell', () => {
    const node = doc(
      table()(
        tr(
          td()(h1('Heading 1'), hr(), h1('Heading 1')),
          td()(h2('Heading 2'), hr(), h2('Heading 2')),
        ),
        tr(
          td()(h3('Heading 3'), hr(), h3('Heading 3')),
          td()(h4('Heading 4'), hr(), h4('Heading 4')),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert Table node with codeBlock in the cell', () => {
    const node = doc(
      table()(
        tr(
          td()(code_block({ language: 'javascript' })('const i = 0;')),
          td()(code_block({ language: 'javascript' })('const i = 0;')),
        ),
        tr(
          td()(code_block({ language: 'javascript' })('const i = 0;')),
          td()(code_block({ language: 'javascript' })('const i = 0;')),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert advanced Table node with merged cells into {adf} macro', () => {
    const node = doc(
      table()(
        tr(
          td({ colspan: 2 })(
            code_block({ language: 'javascript' })('const i = 0;'),
          ),
        ),
        tr(
          td()(code_block({ language: 'javascript' })('const i = 0;')),
          td()(code_block({ language: 'javascript' })('const i = 0;')),
        ),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert advanced Table node by dropping column widths and background colors', () => {
    const node = doc(
      table()(
        tr(
          td({ background: 'red', colwidth: [300] })(
            code_block({ language: 'javascript' })('const i = 0;'),
          ),
        ),
        tr(td()(code_block({ language: 'javascript' })('const i = 0;'))),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert empty table cells', () => {
    const node = doc(table()(tr(th()(p())), tr(td()(p())), tr(td()(p()))))(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert table with newline in cell', () => {
    const node = doc(
      table()(tr(td()(p('hello world'), p())), tr(td()(p('hello world')))),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert table with header column', () => {
    const node = doc(
      table()(
        tr(
          th()(p('Header 0')),
          th()(p('Header Row 1')),
          th()(p('Header Row 2')),
        ),
        tr(th()(p('Header Column 1')), td()(p('Cell 1')), td()(p('Cell 2'))),
        tr(th()(p('Header Column 2')), td()(p('Cell 3')), td()(p('Cell 4'))),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});

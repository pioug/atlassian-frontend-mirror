import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  TablePluginState,
  PluginConfig,
} from '@atlaskit/editor-plugin-table/types';

import { pluginKey as tablePluginKey } from '@atlaskit/editor-plugin-table/plugin-key';
const TABLE_LOCAL_ID = 'test-table-local-id';

describe('fix tables', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  let createAnalyticsEvent: jest.Mock;
  // @ts-ignore
  global['fetch'] = jest.fn();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
      allowColumnResizing: true,
    } as PluginConfig;

    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));

    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
        allowAnalyticsGASV3: true,
      },
      pluginKey: tablePluginKey,
      createAnalyticsEvent,
    });
  };

  describe('removeExtraneousColumnWidths', () => {
    it('removes unneccesary column widths', () => {
      const { editorView } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              th({ colwidth: [100, 100] })(p('{<>}1')),
              th({ colwidth: [100, 100] })(p('2')),
              th({ colwidth: [480] })(p('3')),
            ),
            tr(
              td({ colwidth: [100, 100] })(p('4')),
              td({ colwidth: [100, 100] })(p('5')),
              td({ colwidth: [480] })(p('6')),
            ),
          ),
        ),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              th({ colwidth: [100] })(p('1')),
              th({ colwidth: [100] })(p('2')),
              th({ colwidth: [480] })(p('3')),
            ),
            tr(
              td({ colwidth: [100] })(p('4')),
              td({ colwidth: [100] })(p('5')),
              td({ colwidth: [480] })(p('6')),
            ),
          ),
        ),
      );
    });
  });

  describe('cells with negative rowSpan', () => {
    const TABLE_LOCAL_ID = 'test-table-2';
    const SPAN_VALUE = -2;
    it('should fire v3 analytics', () => {
      editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td({ rowspan: SPAN_VALUE })(p('')),
              td({})(p('')),
              td({})(p('')),
            ),
            tr(td({})(p('')), td({})(p('')), td({})(p(''))),
          ),
        ),
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'invalidDocumentEncountered',
          actionSubject: 'editor',
          attributes: expect.objectContaining({
            nodeType: 'tableCell',
            reason: 'rowspan: negative value',
            tableLocalId: TABLE_LOCAL_ID,
            spanValue: SPAN_VALUE,
          }),
          eventType: 'operational',
        }),
      );
    });
  });

  describe('cells with negative colSpan', () => {
    const TABLE_LOCAL_ID = 'test-table-3';
    const SPAN_VALUE = -2;
    it('should fire v3 analytics', () => {
      editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td({ colspan: SPAN_VALUE })(p('')),
              td({})(p('')),
              td({})(p('')),
            ),
            tr(td({})(p('')), td({})(p('')), td({})(p(''))),
          ),
        ),
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'invalidDocumentEncountered',
          actionSubject: 'editor',
          attributes: expect.objectContaining({
            nodeType: 'tableCell',
            reason: 'colspan: negative value',
            tableLocalId: TABLE_LOCAL_ID,
            spanValue: SPAN_VALUE,
          }),
          eventType: 'operational',
        }),
      );
    });
  });
});

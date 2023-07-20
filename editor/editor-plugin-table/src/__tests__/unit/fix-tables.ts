import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table-plugin';
import { pluginKey as tablePluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { PluginConfig } from '../../plugins/table/types';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('fix tables', () => {
  const createEditor = createProsemirrorEditorFactory();
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

    return createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add([tablePlugin, { tableOptions }]),
      pluginKey: tablePluginKey,
    });
  };

  describe('removeExtraneousColumnWidths', () => {
    it('removes unnecessary column widths', () => {
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
      const { dispatchAnalyticsEvent } = editor(
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

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
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
      const { dispatchAnalyticsEvent } = editor(
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

      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
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

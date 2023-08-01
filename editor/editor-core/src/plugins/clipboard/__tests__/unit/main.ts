import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { clipboardPluginKey } from './../../plugin-key';
import type {
  LightEditorPlugin,
  DispatchAnalyticsEvent,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  hr,
  p,
  table,
  tr,
  th,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import rulePlugin from '../../../rule';
import layoutPlugin from '../../../layout';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import clipboardPlugin from '../../index';
import { sendClipboardAnalytics } from '../../pm-plugins/main';
import { ACTION } from '../../../analytics/types/enums';
import {
  setNodeSelection,
  setTextSelection,
  setAllSelection,
  setCellSelection,
} from '../../../../utils/selection';
// @ts-ignore
import { __serializeForClipboard } from '@atlaskit/editor-prosemirror/view';
import { selectRow } from '@atlaskit/editor-tables/src/utils';
import type { TableAttributes } from '@atlaskit/adf-schema';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('clipboard plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add(clipboardPlugin)
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(decorationsPlugin)
    .add(rulePlugin)
    .add(layoutPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add([
      tablesPlugin,
      {
        tableOptions: {
          allowNumberColumn: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
          allowBackgroundColor: true,
          permittedLayouts: 'all',
        },
      },
    ]);

  const editor = (doc: DocBuilder) =>
    createEditor<undefined, PluginKey>({
      doc,
      preset,
      pluginKey: clipboardPluginKey,
    });

  let editorView: EditorView;
  let refs: { [name: string]: number };
  let dispatchAnalyticsEvent: DispatchAnalyticsEvent;

  describe('analytics', () => {
    const analyticsTests = (actionType: 'cut' | 'copied') => {
      const actionTypeEnum = actionType === 'cut' ? ACTION.CUT : ACTION.COPIED;

      beforeEach(() => {
        ({ editorView, refs, dispatchAnalyticsEvent } = editor(
          doc(
            '{pStart}',
            p('testing clipboard plugin{<>}'),
            '{ruleStart}',
            hr(),
            '{ruleEnd}',
          ),
        ));
        (dispatchAnalyticsEvent as jest.Mock).mockClear();
      });

      it(`fires analytics event when node selection is ${actionType}`, () => {
        setNodeSelection(editorView, refs.ruleStart);
        sendClipboardAnalytics(
          editorView,
          dispatchAnalyticsEvent,
          actionTypeEnum,
        );
        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'track',
          action: actionType,
          actionSubject: 'document',
          attributes: {
            content: ['rule'],
          },
        });
      });

      it(`fires analytics event when all selection is ${actionType}`, () => {
        setAllSelection(editorView);
        sendClipboardAnalytics(
          editorView,
          dispatchAnalyticsEvent,
          actionTypeEnum,
        );
        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'track',
          action: actionType,
          actionSubject: 'document',
          attributes: {
            content: ['all'],
          },
        });
      });

      it(`fires analytics event when range selection is ${actionType}`, () => {
        setTextSelection(editorView, refs.pStart, refs.ruleEnd);
        sendClipboardAnalytics(
          editorView,
          dispatchAnalyticsEvent,
          actionTypeEnum,
        );
        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'track',
          action: actionType,
          actionSubject: 'document',
          attributes: {
            content: ['paragraph', 'rule'],
          },
        });
      });

      it(`fires analytics event when empty selection is ${actionType}`, () => {
        setTextSelection(editorView, refs.pStart);
        sendClipboardAnalytics(
          editorView,
          dispatchAnalyticsEvent,
          actionTypeEnum,
        );
        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'track',
          action: actionType,
          actionSubject: 'document',
          attributes: {
            content: ['caret'],
          },
        });
      });

      it(`fires analytics event when cell selection is ${actionType}`, () => {
        ({ editorView, refs, dispatchAnalyticsEvent } = editor(
          doc(
            table()(
              tr(th()(p('{<>}a1')), '{cell2}', th()(p('a2'))),
              tr(td()(p('b1')), '{cell4}', td()(p('b2'))),
            ),
          ),
        ));
        setCellSelection(editorView, refs.cell2, refs.cell4);
        sendClipboardAnalytics(
          editorView,
          dispatchAnalyticsEvent,
          actionTypeEnum,
        );
        expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'track',
          action: actionType,
          actionSubject: 'document',
          attributes: {
            content: ['tableCell', 'tableCell'],
          },
        });
      });
    };

    describe('cut', () => {
      analyticsTests('cut');
    });

    describe('copy', () => {
      analyticsTests('copied');
    });
  });

  describe('clipboardSerializer', () => {
    describe('when copying a table row from a table', () => {
      it.each(['default', 'wide', 'full-width'])(
        'should write to the clipboard a table keeping the same attributes exlcuding the local id, including the layout',
        (tableLayout) => {
          const { editorView } = editor(
            doc(
              table({
                layout: tableLayout as TableAttributes['layout'],
                localId: TABLE_LOCAL_ID,
              })(
                tr(th()(p('1')), th()(p('2')), th()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
                tr(td()(p('7')), td()(p('8')), td()(p('9'))),
              ),
            ),
          );

          // select the row
          const rowSelector = selectRow(0);
          const newTr = rowSelector(editorView.state.tr);

          editorView.dispatch(newTr);

          const { dom } = __serializeForClipboard(
            editorView,
            editorView.state.selection.content(),
          );

          expect(
            dom.querySelector('table').getAttribute('data-layout'),
          ).toEqual(tableLayout);

          // Snapshotting to ensure table and all attributes wrap the row and are written to clipboard.
          expect(dom).toMatchSnapshot();
        },
      );
    });
  });
});

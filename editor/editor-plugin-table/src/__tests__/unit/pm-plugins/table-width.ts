import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { undo } from '@atlaskit/editor-prosemirror/history';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey as tablePluginKey } from '../../../plugins/table/pm-plugins/plugin-key';

const createDoc = (attrs: any) =>
  doc(
    table(attrs)(
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  );

const expectedDocuments = {
  fullWidthAppearanceLayoutDefault: createDoc({
    localId: 'localId',
    isNumberColumnEnabled: false,
    layout: 'default',
    width: 1800,
  }),
  fixedWidthAppearanceLayoutDefault: createDoc({
    localId: 'localId',
    isNumberColumnEnabled: false,
    layout: 'default',
    width: 760,
  }),
  fixedWidthAppearanceLayoutWide: createDoc({
    localId: 'localId',
    isNumberColumnEnabled: false,
    layout: 'wide',
    width: 960,
  }),
  fixedWidthAppearanceLayoutFullWidth: createDoc({
    localId: 'localId',
    isNumberColumnEnabled: false,
    layout: 'full-width',
    width: 1800,
  }),
};

describe('table width', () => {
  const createEditor = createProsemirrorEditorFactory();

  beforeAll(() => {
    // @ts-ignore
    global['fetch'] = jest.fn();
  });

  const editor = (doc: DocBuilder, isFullWidthEnabled = false) => {
    return createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add([
          tablePlugin,
          {
            fullWidthEnabled: isFullWidthEnabled,
            tableResizingEnabled: true, // so table-width plugin is enabled
            tableOptions: {
              advanced: true,
            },
          },
        ]),
      pluginKey: tablePluginKey,
    });
  };

  describe('move selection from outside table to inside  table should fire analytics', () => {
    const TABLE_LOCAL_ID = 'test-table-1';
    it('should fire v3 analytics', () => {
      // create editor with a table and a paragraph below
      // mouse cursor is at the end of the parapgraph
      const {
        dispatchAnalyticsEvent,
        editorView,
        refs: { inTablePos },
      } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('{inTablePos}in cell')), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
          p('hello cursor is here initially{<>}'),
        ),
      );

      // move cursor to where ths inTablePos is
      const $inTablePos = editorView.state.doc.resolve(inTablePos);
      editorView.dispatch(
        editorView.state.tr.setSelection(
          new TextSelection($inTablePos, $inTablePos),
        ),
      );

      // analytics event should be fired
      expect(dispatchAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'selected',
          actionSubject: 'document',
          actionSubjectId: 'table',
          attributes: expect.objectContaining({
            localId: TABLE_LOCAL_ID,
          }),
          eventType: 'track',
        }),
      );
    });
  });

  describe('Load an existing table with width attr equal null', () => {
    describe('full-width editor appearance', () => {
      it('should translate table width attr to 1800', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'default', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
          true,
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fullWidthAppearanceLayoutDefault,
        );
      });

      it('should not remove width when undo is sent', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'default', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
          true,
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fullWidthAppearanceLayoutDefault,
        );

        undo(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fullWidthAppearanceLayoutDefault,
        );
      });
    });
    describe('fixed-width editor appearance', () => {
      it('should translate table width attr to 760 for default layout', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'default', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fixedWidthAppearanceLayoutDefault,
        );
      });

      it('should not remove width when undo is sent', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'default', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fixedWidthAppearanceLayoutDefault,
        );

        undo(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fixedWidthAppearanceLayoutDefault,
        );
      });

      it('should translate table width attr to 960 for wide layout', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'wide', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fixedWidthAppearanceLayoutWide,
        );
      });

      it('should translate table width attr to 1800 for full-width layout', () => {
        const { editorView } = editor(
          doc(
            // @ts-ignore
            table({ localId: 'localId', layout: 'full-width', width: null })(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        // create `replaceDocument` step
        editorView.dispatch(
          editorView.state.tr.setMeta('replaceDocument', true),
        );

        expect(editorView.state.doc).toEqualDocument(
          expectedDocuments.fixedWidthAppearanceLayoutFullWidth,
        );
      });
    });
  });
});

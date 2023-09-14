import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
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

describe('table width', () => {
  const createEditor = createProsemirrorEditorFactory();

  beforeAll(() => {
    // @ts-ignore
    global['fetch'] = jest.fn();
  });

  const editor = (doc: DocBuilder) => {
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
});

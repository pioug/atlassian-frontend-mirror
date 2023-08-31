import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  FloatingToolbarButton,
  FloatingToolbarItem,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table';
import { setEditorFocus, setTableRef } from '../../plugins/table/commands';
import { getToolbarConfig } from '../../plugins/table/toolbar';

const formatMessage: (t: { id: string }) => string = (message) =>
  `${message.id}`;

describe('getToolbarConfig', () => {
  const getEditorContainerWidth = () => ({ width: 500 });
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };
  const getEditorFeatureFlags: GetEditorFeatureFlags = jest
    .fn()
    .mockReturnValue({});
  const getButton = (editorView: EditorView) => {
    const { state } = editorView;
    const config = getToolbarConfig(
      getEditorContainerWidth,
      editorAnalyticsAPIFake,
      getEditorFeatureFlags,
      () => editorView,
    )({})(state, { formatMessage } as any, {} as any)!;
    //
    expect(config).not.toBeUndefined();
    expect(Array.isArray(config.items)).toBeTruthy();

    const items =
      typeof config.items === 'function'
        ? config.items(state.doc.firstChild!)
        : config.items;

    const button = items.find(
      (item: FloatingToolbarItem<any>) =>
        item.type === 'button' && item.id === 'editor.table.delete',
    )! as FloatingToolbarButton<any>;

    expect(button).not.toBeUndefined();
    return button;
  };

  const createEditorFn = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    const output = createEditorFn({
      doc,

      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(decorationsPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(tablePlugin),
    });

    // Prep the table plugin state a little
    const { editorView } = output;
    const { dispatch } = editorView;
    const tableRef = document.querySelector(
      '.ProseMirror table',
    ) as HTMLTableElement;
    setEditorFocus(true)(output.editorView.state, dispatch);
    setTableRef(tableRef)(output.editorView.state, dispatch);

    return output;
  };

  describe('should not add confirmDialog to delete button', () => {
    it('if no localId', () => {
      const { editorView } = createEditor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty))),
      );

      const button = getButton(editorView);
      expect(button.confirmDialog).toBeUndefined();
    });

    it('if localId defined but not referenced', () => {
      const { editorView } = createEditor(
        doc(
          p('text'),
          table({ localId: 'unreferenced' })(tr(tdCursor, tdEmpty)),
        ),
      );

      const button = getButton(editorView);
      expect(button.confirmDialog).toBeUndefined();
    });
  });
});

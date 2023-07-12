import { EditorView } from 'prosemirror-view';
import {
  doc,
  p,
  tr,
  table,
  tdCursor,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import tablePlugin from '../../plugins/table';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { getToolbarConfig } from '../../plugins/table/toolbar';
import { setTableRef, setEditorFocus } from '../../plugins/table/commands';
import type {
  FloatingToolbarItem,
  FloatingToolbarButton,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

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

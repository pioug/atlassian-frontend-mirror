import {
  doc,
  DocBuilder,
  p,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  FloatingToolbarButton,
  FloatingToolbarItem,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import dataConsumerPlugin from '@atlaskit/editor-core/src/plugins/data-consumer';
import extensionPlugin from '@atlaskit/editor-core/src/plugins/extension';
import tablePlugin from '../../plugins/table';
import { setEditorFocus, setTableRef } from '../../plugins/table/commands';
import { getToolbarConfig } from '../../plugins/table/toolbar';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

const formatMessage: (t: { id: string }) => string = (message) =>
  `${message.id}`;

describe('color picker', () => {
  /**
   * Use `createEditorFactory` here to enable referentiality as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditorFn = createProsemirrorEditorFactory();
  const createEditor = (doc: DocBuilder) => {
    const output = createEditorFn({
      doc,

      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(dataConsumerPlugin)
        .add(extensionPlugin)
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

  it('should return a corect color picker option if allowBackgroundColor enabled', async () => {
    const { editorView } = createEditor(
      doc(p('text'), table()(tr(tdCursor, tdEmpty))),
    );
    const getEditorContainerWidth = () => ({ width: 500 });
    const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
      attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
    };

    // Enable tableCellOptionsInFloatingToolbar
    const getEditorFeatureFlags: GetEditorFeatureFlags = jest
      .fn()
      .mockReturnValue({
        tableCellOptionsInFloatingToolbar: true,
      });

    // Enable allowBackgroundColor feature flag
    const { state } = editorView;
    (state as any).tablePlugin$.pluginConfig.allowBackgroundColor = true;

    // Create the editor
    const config = getToolbarConfig(
      getEditorContainerWidth,
      editorAnalyticsAPIFake,
      getEditorFeatureFlags,
      () => editorView,
    )({})(state, { formatMessage } as any, {} as any)!;

    // Let's find the colorPicker from the option items list
    const items =
      typeof config.items === 'function'
        ? config.items(state.doc.firstChild!)
        : config.items;

    const option = items.find(
      (item: FloatingToolbarItem<any>) =>
        item.type === 'select' && item.id === 'editor.table.colorPicker',
    )! as FloatingToolbarButton<any>;
    expect(option).not.toBeUndefined();
  });
});

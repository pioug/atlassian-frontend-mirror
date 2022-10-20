import { EditorView } from 'prosemirror-view';
import {
  doc,
  p,
  tr,
  table,
  tdCursor,
  tdEmpty,
  dataConsumer,
  extension,
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
import extensionPlugin from '@atlaskit/editor-core/src/plugins/extension';
import dataConsumerPlugin from '@atlaskit/editor-core/src/plugins/data-consumer';
import type {
  FloatingToolbarItem,
  FloatingToolbarButton,
} from '@atlaskit/editor-common/types';

const formatMessage: (t: { id: string }) => string = (message) =>
  `${message.id}`;

describe('getToolbarConfig', () => {
  const getEditorContainerWidth = () => ({ width: 500 });
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };
  const getButton = (editorView: EditorView) => {
    const { state } = editorView;
    const config = getToolbarConfig(
      getEditorContainerWidth,
      editorAnalyticsAPIFake,
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

  describe('should add confirmDialog to delete button', () => {
    it('if localId defined and is referenced', () => {
      const { editorView } = createEditor(
        doc(
          p('text'),
          table({ localId: 'ILY300' })(tr(tdCursor, tdEmpty)),
          dataConsumer({ sources: ['ILY300'] })(
            extension({
              extensionKey: 'test-key-123',
              extensionType: 'com.atlassian.extensions.update',
              parameters: { count: 0 },
              layout: 'default',
              localId: 'testId0',
            })(),
          ),
        ),
      );

      const button = getButton(editorView);
      expect(button.confirmDialog).toEqual({
        message: 'fabric.editor.tables.confirmDeleteLinkedModalMessage',
        okButtonLabel: 'fabric.editor.tables.confirmDeleteLinkedModalOKButton',
      });
    });
  });
});

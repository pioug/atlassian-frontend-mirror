import React from 'react';
import { EditorView } from 'prosemirror-view';
import {
  doc,
  DocBuilder,
  p,
  extension,
  Refs,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createFakeExtensionProvider,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers/extensions';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';

import {
  flushPromises,
  waitForProvider,
} from '../../../../../../__tests__/__helpers/utils';
import { selectNode } from '../../../../../../utils/commands';
import { setTextSelection } from '../../../../../../utils/selection';
import { EditorProps } from '../../../../../../types';
import { getPluginState } from '../../../../plugin-factory';
import { pluginKey } from '../../../../plugin-key';
import { findNodePosWithLocalId } from '../../../../utils';

const LOCALID_EDITABLE = 'editable-extension-localid';
const LOCALID_UNEDITABLE = 'uneditable-extension-localid';

const ExtensionHandlerComponent = () => <div>Awesome Extension</div>;

// #region Set up editor with extensions enabled
interface InitEditorReturn {
  editorView: EditorView;
  refs: Refs;
}

const initEditor = async (content: DocBuilder): Promise<InitEditorReturn> => {
  const editorFactory = createEditorFactory();
  const editor = (
    doc: DocBuilder,
    props: Partial<EditorProps> = {},
    providerFactory?: ProviderFactory,
  ) => {
    return editorFactory({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowBreakout: true,
        allowExtension: {
          allowBreakout: true,
          allowAutoSave: true,
        },
        extensionHandlers,
        ...props,
      },
      pluginKey,
      providerFactory,
    });
  };

  const extensionProvider = createFakeExtensionProvider(
    'com.atlassian.editor-test',
    'awesome',
    ExtensionHandlerComponent,
    undefined,
    // nodes
    [
      {
        key: 'awesome:editable',
        getFieldsDefinition: async () => [
          { type: 'color', label: 'Color Picker', name: 'testColor' },
        ],
      },
      {
        key: 'awesome:no-edit',
      },
    ],
  );

  const providerFactory = ProviderFactory.create({
    extensionProvider: Promise.resolve(
      combineExtensionProviders([extensionProvider]),
    ),
  });

  const { editorView, refs } = editor(content, {}, providerFactory);

  await waitForProvider(providerFactory)('extensionProvider');
  await flushPromises();

  return {
    editorView,
    refs,
  };
};
// #endregion

const mockEditableExtension = (localId?: string): DocBuilder => {
  return extension({
    extensionKey: 'awesome:editable',
    extensionType: 'com.atlassian.extensions.update',
    parameters: {},
    layout: 'default',
    localId: localId || LOCALID_EDITABLE,
  })();
};

const mockUneditableExtension = (localId?: string): DocBuilder => {
  return extension({
    extensionKey: 'awesome:no-edit',
    extensionType: 'com.atlassian.extensions.noupdate',
    parameters: {},
    layout: 'default',
    localId: localId || LOCALID_UNEDITABLE,
  })();
};

describe('extensions plugin: editable button', () => {
  describe('on selection', () => {
    it('should show edit button when selecting an editable extension', async () => {
      const { editorView } = await initEditor(doc(mockEditableExtension()));

      const nodePos = findNodePosWithLocalId(
        editorView.state,
        LOCALID_EDITABLE,
      )!;
      selectNode(nodePos.pos)(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toEqual(LOCALID_EDITABLE);
      expect(pluginState.element).not.toEqual(undefined);
      expect(pluginState.showEditButton).toBeTruthy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should not show edit button when selecting an un-editable extension', async () => {
      const { editorView } = await initEditor(doc(mockUneditableExtension()));

      const nodePos = findNodePosWithLocalId(
        editorView.state,
        LOCALID_UNEDITABLE,
      )!;
      selectNode(nodePos.pos)(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toEqual(LOCALID_UNEDITABLE);
      expect(pluginState.element).not.toEqual(undefined);
      expect(pluginState.showEditButton).toBeFalsy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should not show edit button when selecting an editable extension then a paragraph', async () => {
      const { editorView, refs } = await initEditor(
        doc(mockEditableExtension(), p('{para}')),
      );

      const nodePos = findNodePosWithLocalId(
        editorView.state,
        LOCALID_EDITABLE,
      )!;
      selectNode(nodePos.pos)(editorView.state, editorView.dispatch);
      setTextSelection(editorView, refs.para);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toBeUndefined();
      expect(pluginState.element).toEqual(undefined);
      expect(pluginState.showEditButton).toBeFalsy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should not show edit button when selecting an un-editable extension then a paragraph', async () => {
      const { editorView, refs } = await initEditor(
        doc(mockUneditableExtension(), p('{para}')),
      );

      const nodePos = findNodePosWithLocalId(
        editorView.state,
        LOCALID_UNEDITABLE,
      )!;
      selectNode(nodePos.pos)(editorView.state, editorView.dispatch);
      setTextSelection(editorView, refs.para);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toBeUndefined();
      expect(pluginState.element).toEqual(undefined);
      expect(pluginState.showEditButton).toBeFalsy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should show edit button when selecting an editable extension then another editable extension', async () => {
      const { editorView } = await initEditor(
        doc(mockEditableExtension(), mockEditableExtension('other-editable')),
      );

      const nodePos1 = findNodePosWithLocalId(
        editorView.state,
        LOCALID_EDITABLE,
      )!;
      selectNode(nodePos1.pos)(editorView.state, editorView.dispatch);
      const nodePos2 = findNodePosWithLocalId(
        editorView.state,
        'other-editable',
      )!;
      selectNode(nodePos2.pos)(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toEqual('other-editable');
      expect(pluginState.element).not.toEqual(undefined);
      expect(pluginState.showEditButton).toBeTruthy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should not show edit button when selecting an editable extension then an un-editable extension', async () => {
      const { editorView } = await initEditor(
        doc(mockEditableExtension(), mockUneditableExtension()),
      );

      const nodePos1 = findNodePosWithLocalId(
        editorView.state,
        LOCALID_EDITABLE,
      )!;
      selectNode(nodePos1.pos)(editorView.state, editorView.dispatch);
      const nodePos2 = findNodePosWithLocalId(
        editorView.state,
        LOCALID_UNEDITABLE,
      )!;
      selectNode(nodePos2.pos)(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toEqual(LOCALID_UNEDITABLE);
      expect(pluginState.element).not.toEqual(undefined);
      expect(pluginState.showEditButton).toBeFalsy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });

    it('should show edit button when selecting an un-editable extension then an editable extension', async () => {
      const { editorView } = await initEditor(
        doc(mockEditableExtension(), mockUneditableExtension()),
      );

      const nodePos1 = findNodePosWithLocalId(
        editorView.state,
        LOCALID_UNEDITABLE,
      )!;
      selectNode(nodePos1.pos)(editorView.state, editorView.dispatch);
      const nodePos2 = findNodePosWithLocalId(
        editorView.state,
        LOCALID_EDITABLE,
      )!;
      selectNode(nodePos2.pos)(editorView.state, editorView.dispatch);

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.localId).toEqual(LOCALID_EDITABLE);
      expect(pluginState.element).not.toEqual(undefined);
      expect(pluginState.showEditButton).toBeTruthy();
      expect(pluginState.showContextPanel).toBeFalsy();
    });
  });

  describe('should not trigger state updates', () => {
    it('when typing outside of an extension', async () => {
      const { editorView, refs } = await initEditor(
        doc(mockEditableExtension(), p('{para}')),
      );
      const { dispatch } = editorView;

      setTextSelection(editorView, refs.para);

      const pluginState1 = getPluginState(editorView.state);
      dispatch(editorView.state.tr.insertText('yo!'));
      const pluginState2 = getPluginState(editorView.state);

      expect(pluginState1).toEqual(pluginState2);
    });
  });

  // * - Known issue: typing inside of a bodiedExtension, state shouldn't update
});

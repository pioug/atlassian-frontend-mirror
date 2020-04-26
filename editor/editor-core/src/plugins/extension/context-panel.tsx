import React from 'react';
import { NodeSelection, EditorState } from 'prosemirror-state';
import { getExtensionKeyAndNodeKey } from '@atlaskit/editor-common/extensions';
import { getPluginState } from './pm-plugins/main';
import { getSelectedExtension } from './utils';
import WithEditorActions from '../../ui/WithEditorActions';
import ConfigPanelLoader from '../../ui/ConfigPanel/ConfigPanelLoader';
import { clearEditingContext } from './commands';
import { performNodeUpdate } from './actions';

export const getContextPanel = (allowAutoSave?: boolean) => (
  state: EditorState,
) => {
  // Adding checks to bail out early
  if (
    !(state.selection instanceof NodeSelection) ||
    state.selection.empty ||
    !getSelectedExtension(state)
  ) {
    return;
  }
  const extensionState = getPluginState(state);

  if (
    extensionState &&
    extensionState.showContextPanel &&
    extensionState.extensionProvider &&
    extensionState.processParametersAfter
  ) {
    const node = state.selection.node.toJSON();
    const { extensionType, extensionKey, parameters } = node.attrs;

    const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey);

    const configParams = extensionState.processParametersBefore
      ? extensionState.processParametersBefore(parameters)
      : parameters;

    return (
      <WithEditorActions
        render={actions => {
          const editorView = actions._privateGetEditorView();

          return (
            <ConfigPanelLoader
              showHeader
              closeOnEsc
              extensionType={extensionType}
              extensionKey={extKey}
              nodeKey={nodeKey}
              parameters={configParams}
              extensionProvider={extensionState.extensionProvider!}
              autoSave={allowAutoSave}
              onChange={async params => {
                const newParameters = await extensionState.processParametersAfter!(
                  params,
                );

                const newAttrs = {
                  ...node.attrs,
                  parameters: {
                    ...parameters,
                    ...newParameters,
                  },
                };

                performNodeUpdate(newAttrs, false)(
                  editorView!.state,
                  editorView!.dispatch,
                );
              }}
              onCancel={() => {
                clearEditingContext(editorView!.state, editorView!.dispatch);
              }}
            />
          );
        }}
      />
    );
  }
};

import React from 'react';
import { EditorState } from 'prosemirror-state';
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
  const nodeWithPos = getSelectedExtension(state, true);

  // Adding checks to bail out early
  if (!nodeWithPos) {
    return;
  }

  const extensionState = getPluginState(state);

  if (
    extensionState &&
    extensionState.showContextPanel &&
    extensionState.extensionProvider &&
    extensionState.processParametersAfter
  ) {
    const node = nodeWithPos.node;
    const { extensionType, extensionKey, parameters } = node.attrs;

    const [extKey, nodeKey] = getExtensionKeyAndNodeKey(
      extensionKey,
      extensionType,
    );

    const configParams = extensionState.processParametersBefore
      ? extensionState.processParametersBefore(parameters)
      : parameters;

    return (
      <WithEditorActions
        render={actions => {
          const editorView = actions._privateGetEditorView();

          if (!editorView) {
            return null;
          }

          return (
            <ConfigPanelLoader
              showHeader
              closeOnEsc
              extensionType={extensionType}
              extensionKey={extKey}
              nodeKey={nodeKey}
              extensionParameters={parameters}
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

                performNodeUpdate(
                  node.toJSON().type,
                  newAttrs,
                  node.content,
                  false,
                )(editorView.state, editorView.dispatch);
              }}
              onCancel={() => {
                clearEditingContext(editorView.state, editorView.dispatch);
              }}
            />
          );
        }}
      />
    );
  }
};

import React from 'react';
import { EditorState } from 'prosemirror-state';
import { getExtensionKeyAndNodeKey } from '@atlaskit/editor-common/extensions';
import { getPluginState } from './pm-plugins/main';
import { getSelectedExtension } from './utils';
import WithEditorActions from '../../ui/WithEditorActions';
import ConfigPanelLoader from '../../ui/ConfigPanel/ConfigPanelLoader';
import { clearEditingContext, forceAutoSave } from './commands';

import type { EditorView } from 'prosemirror-view';
import type { ContentNodeWithPos } from 'prosemirror-utils';
import type { ExtensionState } from './types';
import { buildExtensionNode } from './actions';
import { updateState } from './commands';

export const getContextPanel = (allowAutoSave?: boolean) => (
  state: EditorState,
) => {
  const nodeWithPos = getSelectedExtension(state, true);

  // Adding checks to bail out early
  if (!nodeWithPos) {
    return;
  }

  const extensionState = getPluginState(state);
  const {
    autoSaveResolve,
    showContextPanel,
    extensionProvider,
    processParametersBefore,
    processParametersAfter,
  } = extensionState;

  if (
    extensionState &&
    showContextPanel &&
    extensionProvider &&
    processParametersAfter
  ) {
    const { extensionType, extensionKey, parameters } = nodeWithPos.node.attrs;
    const [extKey, nodeKey] = getExtensionKeyAndNodeKey(
      extensionKey,
      extensionType,
    );

    const configParams = processParametersBefore
      ? processParametersBefore(parameters)
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
              extensionProvider={extensionProvider}
              autoSave={allowAutoSave}
              autoSaveTrigger={autoSaveResolve}
              onChange={async updatedParameters => {
                await onChangeAction(
                  editorView,
                  updatedParameters,
                  parameters,
                  nodeWithPos,
                );

                if (autoSaveResolve) {
                  autoSaveResolve();
                }
              }}
              onCancel={async () => {
                if (allowAutoSave) {
                  await new Promise(resolve => {
                    forceAutoSave(resolve)(
                      editorView.state,
                      editorView.dispatch,
                    );
                  });
                }

                clearEditingContext(editorView.state, editorView.dispatch);
              }}
            />
          );
        }}
      />
    );
  }
};

export async function onChangeAction(
  editorView: EditorView,
  updatedParameters: object,
  oldParameters: object,
  nodeWithPos: ContentNodeWithPos,
) {
  // WARNING: editorView.state stales quickly, do not unpack
  const { processParametersAfter } = getPluginState(
    editorView.state,
  ) as ExtensionState;
  if (!processParametersAfter) {
    return;
  }

  const key = Date.now();
  const { positions: previousPositions } = getPluginState(
    editorView.state,
  ) as ExtensionState;

  await updateState({
    positions: {
      ...previousPositions,
      [key]: nodeWithPos.pos,
    },
  })(editorView.state, editorView.dispatch);

  // WARNING: after this, editorView.state may have changed
  const newParameters = await processParametersAfter(updatedParameters);
  const { positions } = getPluginState(editorView.state) as ExtensionState;
  if (!positions) {
    return;
  }
  if (!(key in positions)) {
    return;
  }

  const { node } = nodeWithPos;
  const newNode = buildExtensionNode(
    nodeWithPos.node.toJSON().type,
    editorView.state.schema,
    {
      ...node.attrs,
      parameters: {
        ...oldParameters,
        ...newParameters,
      },
    },
    node.content,
  );

  if (!newNode) {
    return;
  }

  const positionUpdated = positions[key];
  const transaction = editorView.state.tr.replaceWith(
    positionUpdated,
    positionUpdated + newNode.nodeSize,
    newNode,
  );

  const positionsLess: Record<number, number> = {
    ...(getPluginState(editorView.state) as ExtensionState).positions,
  };
  delete positionsLess[key];

  await updateState({
    positions: positionsLess,
  })(editorView.state, editorView.dispatch);

  editorView.dispatch(transaction);
}

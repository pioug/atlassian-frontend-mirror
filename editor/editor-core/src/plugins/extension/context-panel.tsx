import React from 'react';
import { EditorState } from 'prosemirror-state';
import { getExtensionKeyAndNodeKey } from '@atlaskit/editor-common/extensions';
import { getPluginState } from './pm-plugins/main';
import { getSelectedExtension } from './utils';
import WithEditorActions from '../../ui/WithEditorActions';
import ConfigPanelLoader from '../../ui/ConfigPanel/ConfigPanelLoader';
import { duplicateSelection } from '../../utils/selection';
import { clearEditingContext, forceAutoSave, updateState } from './commands';
import { buildExtensionNode } from './actions';
import type { EditorView } from 'prosemirror-view';
import type { ContentNodeWithPos } from 'prosemirror-utils';
import type { ExtensionState } from './types';
import { SaveIndicator } from './ui/SaveIndicator/SaveIndicator';

const areParametersEqual = (
  firstParameters: any,
  secondParameters: any,
): boolean => {
  if (
    typeof firstParameters === 'object' &&
    typeof secondParameters === 'object' &&
    firstParameters !== null &&
    secondParameters !== null
  ) {
    const firstKeys = Object.keys(firstParameters);
    const secondKeys = Object.keys(secondParameters);
    return (
      firstKeys.length === secondKeys.length &&
      firstKeys.every((key) => firstParameters[key] === secondParameters[key])
    );
  }

  return firstParameters === secondParameters;
};

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
      ? processParametersBefore(parameters || {})
      : parameters;

    return (
      <SaveIndicator duration={5000} visible={allowAutoSave}>
        {({ onSaveStarted, onSaveEnded }) => {
          return (
            <WithEditorActions
              render={(actions) => {
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
                    onChange={async (updatedParameters) => {
                      await onChangeAction(
                        editorView,
                        updatedParameters,
                        parameters,
                        nodeWithPos,
                        onSaveStarted,
                      );
                      onSaveEnded();

                      if (autoSaveResolve) {
                        autoSaveResolve();
                      }
                      if (!allowAutoSave) {
                        clearEditingContext(
                          editorView.state,
                          editorView.dispatch,
                        );
                      }
                    }}
                    onCancel={async () => {
                      if (allowAutoSave) {
                        await new Promise((resolve) => {
                          forceAutoSave(resolve)(
                            editorView.state,
                            editorView.dispatch,
                          );
                        });
                      }

                      clearEditingContext(
                        editorView.state,
                        editorView.dispatch,
                      );
                    }}
                  />
                );
              }}
            />
          );
        }}
      </SaveIndicator>
    );
  }
};

export async function onChangeAction(
  editorView: EditorView,
  updatedParameters: object = {},
  oldParameters: object = {},
  nodeWithPos: ContentNodeWithPos,
  onSaving?: () => void,
) {
  // WARNING: editorView.state stales quickly, do not unpack
  const { processParametersAfter, processParametersBefore } = getPluginState(
    editorView.state,
  ) as ExtensionState;

  if (!processParametersAfter) {
    return;
  }

  const unwrappedOldParameters = processParametersBefore
    ? processParametersBefore(oldParameters)
    : oldParameters;
  // todo: update to only check parameters which are in the manifest's field definitions
  if (areParametersEqual(unwrappedOldParameters, updatedParameters)) {
    return;
  }

  if (onSaving) {
    onSaving();
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
    node.marks,
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

  // Ensure we preserve the selection, tr.replaceWith causes it to be lost in some cases
  // when replacing the node
  const { selection: prevSelection } = editorView.state;
  if (!prevSelection.eq(transaction.selection)) {
    const selection = duplicateSelection(prevSelection, transaction.doc);
    if (selection) {
      transaction.setSelection(selection);
    }
  }

  const positionsLess: Record<number, number> = {
    ...(getPluginState(editorView.state) as ExtensionState).positions,
  };
  delete positionsLess[key];

  await updateState({
    positions: positionsLess,
  })(editorView.state, editorView.dispatch);

  editorView.dispatch(transaction);
}

import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
  Parameters,
  TransformAfter,
  TransformBefore,
} from '@atlaskit/editor-common/extensions';
import { removeConnectedNodes } from '@atlaskit/editor-common/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  removeParentNodeOfType,
  removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';

import { createCommand } from './plugin-factory';
import type { ExtensionAction, ExtensionState, RejectSave } from './types';
import { getSelectedExtension } from './utils';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

export function updateState(state: Partial<ExtensionState>) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: state,
  });
}

export function setEditingContextToContextPanel<
  T extends Parameters = Parameters,
>(
  processParametersBefore: TransformBefore<T>,
  processParametersAfter: TransformAfter<T>,
  applyChangeToContextPanel: ApplyChangeHandler | undefined,
) {
  return createCommand<ExtensionAction<T>>(
    {
      type: 'UPDATE_STATE',
      data: {
        showContextPanel: true,
        processParametersBefore,
        processParametersAfter,
      },
    },
    applyChangeToContextPanel,
  );
}

export const clearEditingContext = (
  applyChangeToContextPanel: ApplyChangeHandler | undefined,
) =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: {
        showContextPanel: false,
        processParametersBefore: undefined,
        processParametersAfter: undefined,
      },
    },
    applyChangeToContextPanel,
  );

export const forceAutoSave =
  (applyChangeToContextPanel: ApplyChangeHandler | undefined) =>
  (resolve: () => void, reject?: RejectSave) =>
    createCommand(
      {
        type: 'UPDATE_STATE',
        data: { autoSaveResolve: resolve, autoSaveReject: reject },
      },
      applyChangeToContextPanel,
    );

export const updateExtensionLayout = (layout: ExtensionLayout) =>
  createCommand({ type: 'UPDATE_STATE', data: { layout } }, (tr, state) => {
    const selectedExtension = getSelectedExtension(state, true);

    if (selectedExtension) {
      const trWithNewNodeMarkup: Transaction = tr.setNodeMarkup(
        selectedExtension.pos,
        undefined,
        {
          ...selectedExtension.node.attrs,
          layout,
        },
      );
      trWithNewNodeMarkup.setMeta('scrollIntoView', false);
      return trWithNewNodeMarkup;
    }

    return tr;
  });

export const removeExtension = (editorAnalyticsAPI?: EditorAnalyticsAPI) =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: { element: undefined },
    },
    (tr, state) => {
      if (getSelectedExtension(state)) {
        return removeSelectedNode(tr);
      } else {
        return checkAndRemoveExtensionNode(state, tr, editorAnalyticsAPI);
      }
    },
  );

export const removeDescendantNodes = (sourceNode?: PMNode) =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: { element: undefined },
    },
    (tr, state) => {
      return sourceNode ? removeConnectedNodes(state, sourceNode) : tr;
    },
  );

export const checkAndRemoveExtensionNode = (
  state: EditorState,
  tr: Transaction,
  analyticsApi?: EditorAnalyticsAPI,
) => {
  let nodeType = state.schema.nodes.bodiedExtension;
  const maybeMBENode = findParentNodeOfType(
    state.schema.nodes.multiBodiedExtension,
  )(state.selection);
  if (maybeMBENode) {
    nodeType = state.schema.nodes.multiBodiedExtension;
    if (analyticsApi) {
      analyticsApi.attachAnalyticsEvent({
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.MULTI_BODIED_EXTENSION,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          extensionType: maybeMBENode.node.attrs.extensionType,
          extensionKey: maybeMBENode.node.attrs.extensionKey,
          localId: maybeMBENode.node.attrs.localId,
          currentFramesCount: maybeMBENode.node.content.childCount,
        },
      })(tr);
    }
  }
  return removeParentNodeOfType(nodeType)(tr);
};

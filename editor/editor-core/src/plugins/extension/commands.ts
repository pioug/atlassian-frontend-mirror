import {
  removeSelectedNode,
  removeParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { createCommand } from './plugin-factory';
import type { ExtensionAction, ExtensionState } from './types';
import { getSelectedExtension } from './utils';
import { removeConnectedNodes } from '@atlaskit/editor-common/utils';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type {
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/src/extensions';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';

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
  (resolve: () => void, reject?: (reason?: any) => void) =>
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
      const trWithNewNodeMarkup = tr.setNodeMarkup(
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

export const removeExtension = () =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: { element: undefined },
    },
    (tr, state) => {
      if (getSelectedExtension(state)) {
        return removeSelectedNode(tr);
      } else {
        return removeParentNodeOfType(state.schema.nodes.bodiedExtension)(tr);
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

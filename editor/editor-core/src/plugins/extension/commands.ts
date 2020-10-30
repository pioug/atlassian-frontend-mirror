import { removeSelectedNode, removeParentNodeOfType } from 'prosemirror-utils';
import { ExtensionLayout } from '@atlaskit/adf-schema';

import { applyChange } from '../context-panel/transforms';
import { createCommand } from './plugin-factory';
import { ExtensionAction, ExtensionState } from './types';
import { getSelectedExtension } from './utils';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  Parameters,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/src/extensions';

export function updateState(state: Partial<ExtensionState>) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: state,
  });
}

export function setEditingContextToContextPanel<
  T extends Parameters = Parameters
>(
  processParametersBefore: TransformBefore<T>,
  processParametersAfter: TransformAfter<T>,
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
    applyChange,
  );
}

export const clearEditingContext = createCommand(
  {
    type: 'UPDATE_STATE',
    data: {
      showContextPanel: false,
      processParametersBefore: undefined,
      processParametersAfter: undefined,
    },
  },
  applyChange,
);

export const forceAutoSave = (value: () => void) =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: { autoSaveResolve: value },
    },
    applyChange,
  );

export const showContextPanel = createCommand(
  {
    type: 'UPDATE_STATE',
    data: { showContextPanel: true },
  },
  applyChange,
);

export const updateExtensionLayout = (layout: ExtensionLayout) =>
  createCommand({ type: 'UPDATE_STATE', data: { layout } }, (tr, state) => {
    const selectedExtension = getSelectedExtension(state, true);

    if (selectedExtension) {
      return tr.setNodeMarkup(selectedExtension.pos, undefined, {
        ...selectedExtension.node.attrs,
        layout,
      });
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

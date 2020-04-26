import { Slice, Schema, Node as PmNode } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { replaceSelectedNode } from 'prosemirror-utils';

import {
  UpdateExtension,
  UpdateContextActions,
  ParametersGetter,
  AsyncParametersGetter,
} from '@atlaskit/editor-common/extensions';
import { MacroProvider } from '@atlaskit/editor-common/provider-factory';

import { mapFragment } from '../../utils/slice';
import { Command, CommandDispatch } from '../../types';
import { insertMacroFromMacroBrowser } from '../macro';
import { getSelectedExtension } from './utils';
import { setEditingContextToContextPanel } from './commands';

export const performNodeUpdate = (
  newAttrs: object,
  shouldScrollIntoView: boolean,
) => (state: EditorState, dispatch?: CommandDispatch) => {
  const newNode = state.schema.nodes.extension.createChecked(newAttrs);
  if (!newNode) {
    return;
  }

  let transaction = replaceSelectedNode(newNode)(state.tr);
  // Replacing selected node doesn't update the selection. `selection.node` still returns the old node
  transaction = transaction.setSelection(
    NodeSelection.create(transaction.doc, state.selection.anchor),
  );

  if (dispatch) {
    dispatch(shouldScrollIntoView ? transaction.scrollIntoView() : transaction);
  }
};

export const updateExtensionParams = (
  updateExtension: UpdateExtension<object>,
  node: { node: PmNode; pos: number },
  actions: UpdateContextActions,
) => async (state: EditorState, dispatch?: CommandDispatch): Promise<void> => {
  if (!state.schema.nodes.extension) {
    return;
  }

  const { parameters } = node.node.attrs;
  const newParameters = await updateExtension(parameters, actions);

  if (newParameters) {
    const newAttrs = {
      ...node.node.attrs,
      parameters: {
        ...parameters,
        ...newParameters,
      },
    };

    return performNodeUpdate(newAttrs, true)(state, dispatch);
  }
};

const createUpdateContextActions = ({
  editInLegacyMacroBrowser,
}: {
  editInLegacyMacroBrowser: () => void;
}) => (
  state: EditorState,
  dispatch?: CommandDispatch,
): UpdateContextActions => {
  return {
    editInContextPanel: (
      processParametersBefore: ParametersGetter,
      processParametersAfter: AsyncParametersGetter,
    ) => {
      setEditingContextToContextPanel(
        processParametersBefore,
        processParametersAfter,
      )(state, dispatch);
    },
    editInLegacyMacroBrowser,
  };
};

export const editExtension = (
  macroProvider: MacroProvider | null,
  updateExtension?: UpdateExtension<object>,
): Command => (state, dispatch): boolean => {
  const nodeWithPos = getSelectedExtension(state, true);

  if (!nodeWithPos) {
    return false;
  }

  const editInLegacyMacroBrowser = () => {
    if (!macroProvider) {
      throw new Error(
        `Missing macroProvider. Can't use the macro browser for updates`,
      );
    }

    insertMacroFromMacroBrowser(
      macroProvider,
      nodeWithPos.node,
      true,
    )(state, dispatch);
  };

  if (updateExtension && dispatch) {
    const actions = createUpdateContextActions({ editInLegacyMacroBrowser })(
      state,
      dispatch,
    );

    updateExtensionParams(
      updateExtension,
      nodeWithPos,
      actions,
    )(state, dispatch);

    return true;
  }

  if (!macroProvider) {
    return false;
  }

  editInLegacyMacroBrowser();

  return true;
};

/**
 * Lift content out of "open" top-level bodiedExtensions.
 * Will not work if bodiedExtensions are nested, or when bodiedExtensions are not in the top level
 */
export const transformSliceToRemoveOpenBodiedExtension = (
  slice: Slice,
  schema: Schema,
) => {
  const { bodiedExtension } = schema.nodes;

  const fragment = mapFragment(slice.content, (node, parent, index) => {
    if (node.type === bodiedExtension && !parent) {
      const currentNodeIsAtStartAndIsOpen = slice.openStart && index === 0;
      const currentNodeIsAtEndAndIsOpen =
        slice.openEnd && index + 1 === slice.content.childCount;

      if (currentNodeIsAtStartAndIsOpen || currentNodeIsAtEndAndIsOpen) {
        return node.content;
      }
    }
    return node;
  });

  // If the first/last child has changed - then we know we've removed a bodied extension & to decrement the open depth
  return new Slice(
    fragment,
    fragment.firstChild &&
    fragment.firstChild!.type !== slice.content.firstChild!.type
      ? slice.openStart - 1
      : slice.openStart,
    fragment.lastChild &&
    fragment.lastChild!.type !== slice.content.lastChild!.type
      ? slice.openEnd - 1
      : slice.openEnd,
  );
};

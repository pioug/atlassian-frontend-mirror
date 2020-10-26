import { Slice, Schema, Node as PmNode } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state';
import {
  replaceSelectedNode,
  replaceParentNodeOfType,
  isNodeSelection,
} from 'prosemirror-utils';

import {
  TransformBefore,
  TransformAfter,
  UpdateExtension,
  UpdateContextActions,
} from '@atlaskit/editor-common/extensions';
import { MacroProvider } from '@atlaskit/editor-common/provider-factory';

import { mapFragment } from '../../utils/slice';
import { Command, CommandDispatch } from '../../types';
import EditorActions from '../../actions';
import { insertMacroFromMacroBrowser } from '../macro';
import { getSelectedExtension } from './utils';
import { setEditingContextToContextPanel } from './commands';

import { getPluginState } from './pm-plugins/main';

export const buildExtensionNode = <S extends Schema>(
  type: 'inlineExtension' | 'extension' | 'bodiedExtension',
  schema: S,
  attrs: object,
  content?: object,
) => {
  switch (type) {
    case 'extension':
      return schema.nodes.extension.createChecked(attrs);
    case 'inlineExtension':
      return schema.nodes.inlineExtension.createChecked(attrs);
    case 'bodiedExtension':
      return schema.nodes.bodiedExtension.create(attrs, content as any);
  }

  return undefined;
};

export const performNodeUpdate = (
  type: 'inlineExtension' | 'extension' | 'bodiedExtension',
  newAttrs: object,
  content: object,
  shouldScrollIntoView: boolean,
) => (state: EditorState, dispatch?: CommandDispatch) => {
  const newNode = buildExtensionNode(type, state.schema, newAttrs, content);

  if (!newNode) {
    return;
  }

  const isNodeSelected = isNodeSelection(state.selection);

  let transaction = state.tr;
  let selection;

  if (!isNodeSelected) {
    // Bodied extensions can trigger an update when the cursor is inside which means that there is no node selected.
    // To work around that we replace the parent and create a text selection instead of new node selection
    transaction = replaceParentNodeOfType(
      state.schema.nodes.bodiedExtension,
      newNode,
    )(transaction);

    // Replacing selected node doesn't update the selection. `selection.node` still returns the old node
    selection = TextSelection.create(transaction.doc, state.selection.anchor);
  } else {
    transaction = replaceSelectedNode(newNode)(transaction);

    // Replacing selected node doesn't update the selection. `selection.node` still returns the old node
    selection = NodeSelection.create(
      transaction.doc,
      transaction.mapping.map(state.selection.anchor),
    );
  }

  transaction = transaction.setSelection(selection);

  if (dispatch) {
    dispatch(shouldScrollIntoView ? transaction.scrollIntoView() : transaction);
  }
};

export const updateExtensionParams = (
  updateExtension: UpdateExtension<object>,
  node: { node: PmNode; pos: number },
  actions: UpdateContextActions,
) => async (state: EditorState, dispatch?: CommandDispatch): Promise<void> => {
  const { attrs, type } = node.node;

  if (!state.schema.nodes[type.name]) {
    return;
  }

  const { parameters, content } = attrs;

  try {
    const newParameters = await updateExtension(parameters, actions);

    if (newParameters) {
      const newAttrs = {
        ...attrs,
        parameters: {
          ...parameters,
          ...newParameters,
        },
      };

      return performNodeUpdate(
        type.name as 'inlineExtension' | 'extension' | 'bodiedExtension',
        newAttrs,
        content,
        true,
      )(state, dispatch);
    }
  } catch {}
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
      transformBefore: TransformBefore,
      transformAfter: TransformAfter,
    ) => {
      setEditingContextToContextPanel(transformBefore, transformAfter)(
        state,
        dispatch,
      );
    },
    editInLegacyMacroBrowser,
  };
};

export const editSelectedExtension = (editorActions: EditorActions) => {
  const editorView = editorActions._privateGetEditorView()!;
  const { updateExtension } = getPluginState(editorView.state);
  return editExtension(null, updateExtension)(
    editorView.state,
    editorView.dispatch,
  );
};

export const editExtension = (
  macroProvider: MacroProvider | null,
  updateExtension?: Promise<UpdateExtension<object> | void>,
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

  if (updateExtension) {
    updateExtension.then(updateMethod => {
      if (updateMethod && dispatch) {
        const actions = createUpdateContextActions({
          editInLegacyMacroBrowser,
        })(state, dispatch);

        updateExtensionParams(
          updateMethod,
          nodeWithPos,
          actions,
        )(state, dispatch);

        return;
      }

      if (!updateMethod && macroProvider) {
        editInLegacyMacroBrowser();
        return;
      }
    });
  } else {
    if (!macroProvider) {
      return false;
    }

    editInLegacyMacroBrowser();
  }

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

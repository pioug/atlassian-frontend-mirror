import { EditorView } from 'prosemirror-view';
import {
  Slice,
  Schema,
  Node as PmNode,
  Fragment,
  Mark,
} from 'prosemirror-model';
import {
  EditorState,
  Selection,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import {
  replaceSelectedNode,
  findSelectedNodeOfType,
  replaceParentNodeOfType,
} from 'prosemirror-utils';

import {
  UpdateExtension,
  ExtensionAPI,
} from '@atlaskit/editor-common/extensions';
import { MacroProvider } from '@atlaskit/editor-common/provider-factory';

import { mapFragment } from '../../utils/slice';
import { Command, CommandDispatch } from '../../types';
import EditorActions from '../../actions';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  addAnalytics,
} from '../analytics';
import {
  ExtensionType,
  SelectionJson,
  TARGET_SELECTION_SOURCE,
} from '../analytics/types/extension-events';

import { findExtensionWithLocalId } from './utils';
import { getPluginState } from './pm-plugins/main';
import {
  getEditInLegacyMacroBrowser,
  createExtensionAPI,
} from './extension-api';

export const buildExtensionNode = <S extends Schema>(
  type: 'inlineExtension' | 'extension' | 'bodiedExtension',
  schema: S,
  attrs: object,
  content?: Fragment,
  marks?: Mark<S>[],
) => {
  switch (type) {
    case 'extension':
      return schema.nodes.extension.createChecked(attrs, content, marks);
    case 'inlineExtension':
      return schema.nodes.inlineExtension.createChecked(attrs, content, marks);
    case 'bodiedExtension':
      return schema.nodes.bodiedExtension.create(attrs, content, marks);
  }
};

export const performNodeUpdate = (
  type: 'inlineExtension' | 'extension' | 'bodiedExtension',
  newAttrs: object,
  content: Fragment<any>,
  marks: Mark[],
  shouldScrollIntoView: boolean,
): Command => (_state, _dispatch, view) => {
  if (!view) {
    throw Error('EditorView is required to perform node update!');
  }
  // NOTE: `state` and `dispatch` are stale at this point so we need to grab
  // the latest one from `view` @see HOT-93986
  const { state, dispatch } = view;

  const newNode = buildExtensionNode(
    type,
    state.schema,
    newAttrs,
    content,
    marks,
  );

  if (!newNode) {
    return false;
  }

  const { selection, schema } = state;
  const { extension, inlineExtension, bodiedExtension } = schema.nodes;
  const isBodiedExtensionSelected = !!findSelectedNodeOfType([bodiedExtension])(
    selection,
  );
  const extensionState = getPluginState(state);
  let targetSelectionSource: TARGET_SELECTION_SOURCE =
    TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
  let action = ACTION.UPDATED;
  let { tr } = state;

  // When it's a bodiedExtension but not selected
  if (newNode.type === bodiedExtension && !isBodiedExtensionSelected) {
    // Bodied extensions can trigger an update when the cursor is inside which means that there is no node selected.
    // To work around that we replace the parent and create a text selection instead of new node selection
    tr = replaceParentNodeOfType(
      state.schema.nodes.bodiedExtension,
      newNode,
    )(tr);
    // Replacing selected node doesn't update the selection. `selection.node` still returns the old node
    tr.setSelection(TextSelection.create(tr.doc, state.selection.anchor));
  }
  // If any extension is currently selected
  else if (
    findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])(
      selection,
    )
  ) {
    tr = replaceSelectedNode(newNode)(tr);
    // Replacing selected node doesn't update the selection. `selection.node` still returns the old node
    tr.setSelection(
      NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)),
    );
  }
  // When we loose the selection. This usually happens when Synchrony resets or changes
  // the selection when user is in the middle of updating an extension.
  else if (extensionState.element) {
    const pos = view.posAtDOM(extensionState.element, -1);
    if (pos > -1) {
      tr = tr.replaceWith(pos, pos + (content.size || 0) + 1, newNode);
      tr.setSelection(Selection.near(tr.doc.resolve(pos)));
      targetSelectionSource = TARGET_SELECTION_SOURCE.HTML_ELEMENT;
    } else {
      action = ACTION.ERRORED;
    }
  }

  // Only scroll if we have anything to update, best to avoid surprise scroll
  if (dispatch && tr.docChanged) {
    const { extensionType, extensionKey, layout, localId } = newNode.attrs;
    addAnalytics(state, tr, {
      action,
      actionSubject: ACTION_SUBJECT.EXTENSION,
      actionSubjectId: newNode.type.name as ExtensionType,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.CONFIG_PANEL,
        extensionType,
        extensionKey,
        layout,
        localId,
        selection: tr.selection.toJSON() as SelectionJson,
        targetSelectionSource,
      },
    });
    dispatch(shouldScrollIntoView ? tr.scrollIntoView() : tr);
  }
  return true;
};

export const updateExtensionParams = (
  updateExtension: UpdateExtension<object>,
  node: { node: PmNode; pos: number },
  actions: ExtensionAPI,
) => async (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
): Promise<boolean> => {
  const { attrs, type, content, marks } = node.node;

  if (!state.schema.nodes[type.name]) {
    return false;
  }

  const { parameters } = attrs;
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
        marks,
        true,
      )(state, dispatch, view);
    }
  } catch {}
  return true;
};

export const editSelectedExtension = (editorActions: EditorActions) => {
  const editorView = editorActions._privateGetEditorView()!;
  const { updateExtension } = getPluginState(editorView.state);
  return editExtension(null, updateExtension)(
    editorView.state,
    editorView.dispatch,
    editorView,
  );
};

export const editExtension = (
  macroProvider: MacroProvider | null,
  updateExtension?: Promise<UpdateExtension<object> | void>,
): Command => (state, dispatch, view): boolean => {
  if (!view) {
    return false;
  }
  const { localId } = getPluginState(state);
  const nodeWithPos = findExtensionWithLocalId(state, localId);

  if (!nodeWithPos) {
    return false;
  }

  const editInLegacyMacroBrowser = getEditInLegacyMacroBrowser({
    view,
    macroProvider: macroProvider || undefined,
  });

  if (updateExtension) {
    updateExtension.then((updateMethod) => {
      if (updateMethod && view) {
        const actions = createExtensionAPI({
          editorView: view,
          editInLegacyMacroBrowser,
        });

        updateExtensionParams(updateMethod, nodeWithPos, actions)(
          state,
          dispatch,
          view,
        );

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

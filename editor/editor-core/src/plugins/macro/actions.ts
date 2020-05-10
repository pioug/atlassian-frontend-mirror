import { EditorState, NodeSelection } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import assert from 'assert';
import { getValidNode } from '@atlaskit/editor-common';
import {
  Providers,
  MacroProvider,
  MacroAttributes,
} from '@atlaskit/editor-common/provider-factory';
import {
  safeInsert,
  replaceSelectedNode,
  replaceParentNodeOfType,
} from 'prosemirror-utils';
import { CommandDispatch } from '../../types';

import { normaliseNestedLayout } from '../../utils';
import { pluginKey } from './plugin-key';

export const insertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
  isEditing?: boolean,
) => async (
  state: EditorState,
  dispatch?: CommandDispatch,
): Promise<boolean> => {
  if (!macroProvider) {
    return false;
  }

  // opens MacroBrowser for editing "macroNode" if passed in
  const newMacro: MacroAttributes = await macroProvider.openMacroBrowser(
    macroNode,
  );
  if (newMacro) {
    const currentLayout = (macroNode && macroNode.attrs.layout) || 'default';
    const node = resolveMacro(newMacro, state, { layout: currentLayout });

    if (!node) {
      return false;
    }

    const {
      schema: {
        nodes: { bodiedExtension },
      },
    } = state;
    let { tr } = state;

    const nonSelectedBodiedExtension =
      macroNode!.type === bodiedExtension &&
      !(tr.selection instanceof NodeSelection);

    if (nonSelectedBodiedExtension && !isEditing) {
      tr = safeInsert(node)(tr);
    } else if (nonSelectedBodiedExtension) {
      tr = replaceParentNodeOfType(bodiedExtension, node)(tr);
    } else if (tr.selection instanceof NodeSelection) {
      tr = replaceSelectedNode(node)(tr);
    }

    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  }

  return false;
};

export const resolveMacro = (
  macro?: MacroAttributes,
  state?: EditorState,
  optionalAttrs?: object,
): PmNode | null => {
  if (!macro || !state) {
    return null;
  }

  const { schema } = state;
  const { type, attrs } = getValidNode(macro, schema);
  let node;

  if (type === 'extension') {
    node = schema.nodes.extension.create({ ...attrs, ...optionalAttrs });
  } else if (type === 'bodiedExtension') {
    node = schema.nodes.bodiedExtension.create(
      { ...attrs, ...optionalAttrs },
      schema.nodeFromJSON(macro).content,
    );
  } else if (type === 'inlineExtension') {
    node = schema.nodes.inlineExtension.create(attrs);
  }

  return normaliseNestedLayout(state, node);
};

// gets the macroProvider from the state and tries to autoConvert a given text
export const runMacroAutoConvert = (
  state: EditorState,
  text: String,
): PmNode | null => {
  const macroPluginState = pluginKey.getState(state);

  const macroProvider = macroPluginState && macroPluginState.macroProvider;
  if (!macroProvider || !macroProvider.autoConvert) {
    return null;
  }

  const macroAttributes = macroProvider.autoConvert(text);
  if (!macroAttributes) {
    return null;
  }

  // decides which kind of macro to render (inline|bodied|bodyless) - will be just inline atm.
  return resolveMacro(macroAttributes, state);
};

export const setMacroProvider = (
  provider: Providers['macroProvider'],
) => async (view: EditorView): Promise<boolean> => {
  let resolvedProvider: MacroProvider | undefined | null;
  try {
    resolvedProvider = await provider;
    assert(
      resolvedProvider && resolvedProvider.openMacroBrowser,
      `MacroProvider promise did not resolve to a valid instance of MacroProvider - ${resolvedProvider}`,
    );
  } catch (err) {
    resolvedProvider = null;
  }
  view.dispatch(
    view.state.tr.setMeta(pluginKey, { macroProvider: resolvedProvider }),
  );
  return true;
};

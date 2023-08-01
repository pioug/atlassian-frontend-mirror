import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { getExtensionModuleNode } from '@atlaskit/editor-common/extensions';
import { updateState } from '../commands';
import { getSelectedExtension } from '../utils';

const maybeGetUpdateMethodFromExtensionProvider = async (
  view: EditorView,
  extensionProvider: ExtensionProvider,
) => {
  const nodeWithPos = getSelectedExtension(view.state, true);
  if (!nodeWithPos) {
    throw new Error('There is no selection');
  }

  const { extensionType, extensionKey } = nodeWithPos.node.attrs;

  const extensionModuleNode = await getExtensionModuleNode(
    extensionProvider,
    extensionType,
    extensionKey,
  );

  const newNodeWithPos = getSelectedExtension(view.state, true);

  if (
    newNodeWithPos &&
    newNodeWithPos.node.attrs.extensionType === extensionType &&
    newNodeWithPos.node.attrs.extensionKey === extensionKey &&
    newNodeWithPos.pos === nodeWithPos.pos &&
    extensionModuleNode
  ) {
    return extensionModuleNode.update;
  }
};

export const updateEditButton = async (
  view: EditorView,
  extensionProvider: ExtensionProvider,
) => {
  try {
    const updateMethod = await maybeGetUpdateMethodFromExtensionProvider(
      view,
      extensionProvider,
    );

    updateState({
      showEditButton: !!updateMethod,
      updateExtension:
        (updateMethod && Promise.resolve(updateMethod)) || undefined,
    })(view.state, view.dispatch);

    return updateMethod;
  } catch {
    // this exception is not important for this case, fail silently
  }
};

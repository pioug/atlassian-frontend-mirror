import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import {
  ExtensionHandlers,
  ExtensionProvider,
  getExtensionModuleNode,
  UpdateExtension,
  Extension,
  ExtensionHandler,
} from '@atlaskit/editor-common/extensions';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import ExtensionNodeView from '../nodeviews/extension';
import { updateState, clearEditingContext } from '../commands';
import {
  getSelectedExtension,
  getSelectedDomElement,
  getSelectedNonContentExtension,
} from '../utils';
import {
  createPluginState,
  getPluginState,
  createCommand,
} from '../plugin-factory';
import { pluginKey } from '../plugin-key';

const maybeGetUpdateMethodFromExtensionProvider = async (
  view: EditorView,
  extensionProvider: ExtensionProvider,
) => {
  const nodeWithPos = getSelectedExtension(view.state, true);
  if (!nodeWithPos) {
    throw new Error('There is no selection');
  }

  const { extensionType, extensionKey } = nodeWithPos.node.attrs;

  try {
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
      extensionModuleNode.update
    ) {
      return extensionModuleNode.update;
    }

    throw new Error(
      `Can't find the right handler for ${extensionType}:${extensionKey} on the extension provider!`,
    );
  } catch (err) {
    updateState({
      showEditButton: true,
    })(view.state, view.dispatch);

    throw err;
  }
};

const updateEditButton = async (
  view: EditorView,
  extensionProvider: ExtensionProvider,
) => {
  try {
    const updateMethod = await maybeGetUpdateMethodFromExtensionProvider(
      view,
      extensionProvider,
    );

    updateState({
      showEditButton: true,
      updateExtension: Promise.resolve(updateMethod),
    })(view.state, view.dispatch);

    return updateMethod;
  } catch {
    updateState({
      showEditButton: true,
    })(view.state, view.dispatch);
  }
};

const shouldShowEditButton = (
  extensionHandler?: Extension<any> | ExtensionHandler<any>,
  extensionProvider?: ExtensionProvider,
) => {
  const usesLegacyMacroBrowser =
    (!extensionHandler && !extensionProvider) ||
    typeof extensionHandler === 'function';

  const usesModernUpdateMethod =
    typeof extensionHandler === 'object' &&
    typeof extensionHandler.update === 'function';

  if (usesLegacyMacroBrowser || usesModernUpdateMethod) {
    return true;
  }

  return false;
};

const getUpdateExtensionPromise = async (
  view: EditorView,
  extensionHandler?: Extension<any> | ExtensionHandler<any>,
  extensionProvider?: ExtensionProvider,
): Promise<UpdateExtension<object> | void> => {
  if (extensionHandler && typeof extensionHandler === 'object') {
    // Old API with the `update` function
    return extensionHandler.update;
  } else if (extensionProvider) {
    // New API with or without the `update` function, we don't know at this point
    const updateMethod = await updateEditButton(view, extensionProvider);
    if (updateMethod) {
      return updateMethod;
    }
  }

  throw new Error('No update method available');
};

const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
) => {
  const state = createPluginState(dispatch, {
    layout: 'default',
    showEditButton: false,
    showContextPanel: false,
  });

  return new Plugin({
    state,
    view: editorView => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      const providerHandler = (
        name: string,
        provider?: Promise<ExtensionProvider>,
      ) => {
        if (name === 'extensionProvider' && provider) {
          provider
            .then(extensionProvider => {
              updateState({ extensionProvider })(
                editorView.state,
                editorView.dispatch,
              );

              updateEditButton(editorView, extensionProvider);
            })
            .catch(() =>
              updateState({ extensionProvider: undefined })(
                editorView.state,
                editorView.dispatch,
              ),
            );
        }
      };

      providerFactory.subscribe('extensionProvider', providerHandler);

      return {
        update: view => {
          const { state, dispatch } = view;
          const {
            element,
            extensionProvider,
            showContextPanel,
          } = getPluginState(state);

          // This fetches the selected extension node, either by keyboard selection or click for all types of extensions
          const selectedExtension = getSelectedExtension(state, true);

          if (!selectedExtension) {
            if (showContextPanel) {
              clearEditingContext(state, dispatch);
            }

            return;
          }

          const isContentExtension = !!getSelectedNonContentExtension(state);

          const newElement = getSelectedDomElement(
            domAtPos,
            selectedExtension,
            isContentExtension,
          );

          if (element !== newElement) {
            if (showContextPanel) {
              clearEditingContext(state, dispatch);
            }

            const { extensionType } = selectedExtension.node.attrs;
            const extensionHandler = extensionHandlers[extensionType];

            const showEditButton = shouldShowEditButton(
              extensionHandler,
              extensionProvider,
            );

            const updateExtension = getUpdateExtensionPromise(
              view,
              extensionHandler,
              extensionProvider,
            ).catch(() => {
              // do nothing;
            });

            const layout = selectedExtension
              ? selectedExtension.node.attrs.layout
              : 'default';

            updateState({
              nodeWithPos: selectedExtension,
              showContextPanel: false,
              element: newElement,
              showEditButton,
              updateExtension,
              layout,
            })(state, dispatch);
          }
          return true;
        },
        destroy: () => {
          providerFactory.unsubscribe('extensionProvider', providerHandler);
        },
      };
    },
    key: pluginKey,
    props: {
      nodeViews: {
        extension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
        ),
        bodiedExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
        ),
        inlineExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
        ),
      },
    },
  });
};

export { pluginKey, createPlugin, createCommand, getPluginState };

import { EditorView } from 'prosemirror-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  ExtensionHandlers,
  ExtensionProvider,
  getExtensionModuleNode,
  UpdateExtension,
  Extension,
  ExtensionHandler,
} from '@atlaskit/editor-common/extensions';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';

import { EditorAppearance } from '../../../types/editor-appearance';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { createSelectionClickHandler } from '../../selection/utils';
import ExtensionNodeView from '../nodeviews/extension';
import { updateState, clearEditingContext } from '../commands';
import { getSelectedExtension, getSelectedDomElement } from '../utils';
import type { ExtensionState } from '../types';
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

const shouldShowEditButton = (
  extensionHandler?: Extension | ExtensionHandler,
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
  extensionHandler?: Extension | ExtensionHandler,
  extensionProvider?: ExtensionProvider,
): Promise<UpdateExtension | void> => {
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

export const createExtensionProviderHandler = (view: EditorView) => async (
  name: string,
  provider?: Promise<ExtensionProvider>,
) => {
  if (name === 'extensionProvider' && provider) {
    try {
      const extensionProvider = await provider;
      updateState({ extensionProvider })(view.state, view.dispatch);
      await updateEditButton(view, extensionProvider);
    } catch {
      updateState({ extensionProvider: undefined })(view.state, view.dispatch);
    }
  }
};

export const createContextIdentifierProviderHandler = (
  view: EditorView,
) => async (name: string, provider?: Promise<ContextIdentifierProvider>) => {
  if (name === 'contextIdentifierProvider' && provider) {
    try {
      const contextIdentifierProvider = await provider;
      updateState({ contextIdentifierProvider })(view.state, view.dispatch);
    } catch {
      updateState({ contextIdentifierProvider: undefined })(
        view.state,
        view.dispatch,
      );
    }
  }
};

const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  useLongPressSelection: boolean = false,
  options: {
    appearance?: EditorAppearance;
  } = {},
) => {
  const state = createPluginState(dispatch, {
    shouldRefreshEditButton: false,
    showEditButton: false,
    showContextPanel: false,
  });

  const extensionNodeViewOptions = {
    appearance: options.appearance,
  };

  return new SafePlugin({
    state,
    view: (editorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      const extensionProviderHandler = createExtensionProviderHandler(
        editorView,
      );
      const contextIdentificationProviderHandler = createContextIdentifierProviderHandler(
        editorView,
      );

      providerFactory.subscribe('extensionProvider', extensionProviderHandler);
      providerFactory.subscribe(
        'contextIdentificationProvider',
        contextIdentificationProviderHandler,
      );

      return {
        update: (view) => {
          const { state, dispatch } = view;
          const {
            element,
            localId,
            extensionProvider,
            showContextPanel,
            shouldRefreshEditButton,
          } = getPluginState(state);

          if (!shouldRefreshEditButton) {
            return false;
          }

          // This fetches the selected extension node, either by keyboard selection or click for all types of extensions
          const selectedExtension = getSelectedExtension(state, true);

          // If our selection isn't on an extension node, clear some state and hide the config panel
          if (!selectedExtension) {
            if (showContextPanel) {
              clearEditingContext(state, dispatch);
            }

            updateState({
              shouldRefreshEditButton: false,
              localId: undefined,
              element: undefined,
              showEditButton: false,
              updateExtension: undefined,
            })(state, dispatch);
            return;
          }

          // By this point we're certain we've selected an extension node.
          // But we need to determine if the selection has changed to another
          // extension node or remained on the same node.
          const { node } = selectedExtension;
          const newElement = getSelectedDomElement(
            state.schema,
            domAtPos,
            selectedExtension,
          );

          // New node is selection
          const hasSelectedNodeChanged = node.attrs.localId
            ? localId !== node.attrs.localId
            : // This is the current assumption and it's wrong but we are keeping it
              // as fallback in case we need to turn off `allowLocalIdGeneration`
              element !== newElement;

          const nextState: Partial<ExtensionState> = {
            shouldRefreshEditButton: false,
          };

          if (hasSelectedNodeChanged) {
            if (showContextPanel) {
              clearEditingContext(state, dispatch);
            }

            const { extensionType } = node.attrs;
            const extensionHandler = extensionHandlers[extensionType];

            // showEditButton might change async based on results from extension providers
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

            Object.assign(nextState, {
              localId: node.attrs.localId,
              element: newElement,
              showEditButton,
              updateExtension,
            });
          }
          // New DOM element doesn't necessarily mean it's a new Node
          else if (element !== newElement) {
            Object.assign(nextState, {
              element: newElement,
            });
          }

          updateState(nextState)(state, dispatch);
          return true;
        },
        destroy: () => {
          providerFactory.unsubscribe(
            'extensionProvider',
            extensionProviderHandler,
          );
          providerFactory.unsubscribe(
            'contextIdentificationProvider',
            contextIdentificationProviderHandler,
          );
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
          extensionNodeViewOptions,
        ),
        bodiedExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
          extensionNodeViewOptions,
        ),
        inlineExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
          extensionNodeViewOptions,
        ),
      },
      handleClickOn: createSelectionClickHandler(
        ['extension', 'bodiedExtension'],
        (target) => {
          // Clicked on anything around the extension content
          // or specifically on the content border of a bodied extension
          return (
            !target.closest('.extension-content') ||
            target.classList.contains('extension-content')
          );
        },
        { useLongPressSelection },
      ),
    },
  });
};

export { pluginKey, createPlugin, createCommand, getPluginState };

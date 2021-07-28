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
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

import { EditorAppearance } from '../../../types/editor-appearance';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { createSelectionClickHandler } from '../../selection/utils';
import ExtensionNodeView from '../nodeviews/extension';
import { updateState, clearEditingContext } from '../commands';
import { getSelectedExtension, getSelectedDomElement } from '../utils';
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
    layout: 'default',
    showEditButton: false,
    showContextPanel: false,
  });

  const extensionNodeViewOptions = {
    appearance: options.appearance,
  };

  return new Plugin({
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
          } = getPluginState(state);

          // This fetches the selected extension node, either by keyboard selection or click for all types of extensions
          const selectedExtension = getSelectedExtension(state, true);

          if (!selectedExtension) {
            if (showContextPanel) {
              clearEditingContext(state, dispatch);
            }

            return;
          }

          const { node } = selectedExtension;
          const newElement = getSelectedDomElement(
            state.schema,
            domAtPos,
            selectedExtension,
          );

          // New node is selection
          if (
            node.attrs.localId
              ? localId !== node.attrs.localId
              : // This is the current assumption and it's wrong but we are keeping it
                // as fallback in case we need to turn off `allowLocalIdGeneration`
                element !== newElement
          ) {
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

            const layout = selectedExtension ? node.attrs.layout : 'default';

            updateState({
              localId: node.attrs.localId,
              showContextPanel: false,
              element: newElement,
              showEditButton,
              updateExtension,
              layout,
            })(state, dispatch);
          }
          // New DOM element doesn't necessarily mean it's a new Node
          else if (element !== newElement) {
            updateState({ element: newElement })(state, dispatch);
          }

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
        (target) => !target.closest('.extension-content'),
        { useLongPressSelection },
      ),
    },
  });
};

export { pluginKey, createPlugin, createCommand, getPluginState };

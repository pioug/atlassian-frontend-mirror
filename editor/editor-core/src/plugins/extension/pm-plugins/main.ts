import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  ExtensionHandlers,
  ExtensionProvider,
  UpdateExtension,
  Extension,
  ExtensionHandler,
} from '@atlaskit/editor-common/extensions';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
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
import { updateEditButton } from './utils';
import type extensionPlugin from '../index';

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

export const createExtensionProviderHandler =
  (view: EditorView) =>
  async (name: string, provider?: Promise<ExtensionProvider>) => {
    if (name === 'extensionProvider' && provider) {
      try {
        const extensionProvider = await provider;
        updateState({ extensionProvider })(view.state, view.dispatch);
        await updateEditButton(view, extensionProvider);
      } catch {
        updateState({ extensionProvider: undefined })(
          view.state,
          view.dispatch,
        );
      }
    }
  };

export const createContextIdentifierProviderHandler =
  (view: EditorView) =>
  async (name: string, provider?: Promise<ContextIdentifierProvider>) => {
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

export const handleUpdate = ({
  view,
  prevState,
  domAtPos,
  extensionHandlers,
}: {
  view: EditorView;
  prevState: EditorState;
  domAtPos: EditorView['domAtPos'];
  extensionHandlers: ExtensionHandlers;
}) => {
  const { state, dispatch } = view;
  const {
    element,
    localId,
    extensionProvider,
    showContextPanel,
    showEditButton,
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

  // In some cases, showEditButton can be stale and the edit button doesn't show - @see ED-15285
  // To be safe, we update the showEditButton state here
  const shouldUpdateEditButton =
    !showEditButton &&
    extensionProvider &&
    element === newElement &&
    !getSelectedExtension(prevState, true);

  const isNewNodeSelected = node.attrs.localId
    ? localId !== node.attrs.localId
    : // This is the current assumption and it's wrong but we are keeping it
      // as fallback in case we need to turn off `allowLocalIdGeneration`
      element !== newElement;

  if (isNewNodeSelected || shouldUpdateEditButton) {
    if (showContextPanel) {
      clearEditingContext(state, dispatch);
      return;
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

    updateState({
      localId: node.attrs.localId,
      showContextPanel: false,
      element: newElement,
      showEditButton,
      updateExtension,
    })(state, dispatch);
  }
  // New DOM element doesn't necessarily mean it's a new Node
  else if (element !== newElement) {
    updateState({ element: newElement })(state, dispatch);
  }

  return true;
};

const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginInjectionApi: ExtractInjectionAPI<typeof extensionPlugin> | undefined,
  useLongPressSelection: boolean = false,
  options: {
    appearance?: EditorAppearance;
  } = {},
) => {
  const state = createPluginState(dispatch, {
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
      const extensionProviderHandler =
        createExtensionProviderHandler(editorView);
      const contextIdentificationProviderHandler =
        createContextIdentifierProviderHandler(editorView);

      providerFactory.subscribe('extensionProvider', extensionProviderHandler);
      providerFactory.subscribe(
        'contextIdentificationProvider',
        contextIdentificationProviderHandler,
      );

      return {
        update: (view, prevState) => {
          handleUpdate({ view, prevState, domAtPos, extensionHandlers });
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
        // WARNING: referentiality-plugin also creates these nodeviews
        extension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
          extensionNodeViewOptions,
          pluginInjectionApi,
        ),
        // WARNING: referentiality-plugin also creates these nodeviews
        bodiedExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
          extensionNodeViewOptions,
          pluginInjectionApi,
        ),
        // WARNING: referentiality-plugin also creates these nodeviews
        inlineExtension: ExtensionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          extensionHandlers,
          extensionNodeViewOptions,
          pluginInjectionApi,
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

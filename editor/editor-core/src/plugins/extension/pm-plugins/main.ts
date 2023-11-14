import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  TextSelection,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfTypeClosestToPos,
  findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ExtensionHandlers,
  ExtensionProvider,
  UpdateExtension,
  Extension,
  ExtensionHandler,
} from '@atlaskit/editor-common/extensions';

import {
  isSelectionAtStartOfNode,
  isSelectionAtEndOfNode,
  createSelectionClickHandler,
} from '@atlaskit/editor-common/selection';
import type {
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common/provider-factory';
import type {
  ExtractInjectionAPI,
  EditorAppearance,
} from '@atlaskit/editor-common/types';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';

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
  applyChange,
}: {
  view: EditorView;
  prevState: EditorState;
  domAtPos: EditorView['domAtPos'];
  extensionHandlers: ExtensionHandlers;
  applyChange: ApplyChangeHandler | undefined;
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
      clearEditingContext(applyChange)(state, dispatch);
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
      clearEditingContext(applyChange)(state, dispatch);
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
    applyChangeToContextPanel:
      pluginInjectionApi?.contextPanel?.actions?.applyChange,
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
          handleUpdate({
            view,
            prevState,
            domAtPos,
            extensionHandlers,
            applyChange: pluginInjectionApi?.contextPanel?.actions.applyChange,
          });
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
      handleDOMEvents: {
        /**
         * ED-18072 - Cannot shift + arrow past bodied extension if it is not empty.
         * This code is to handle the case where the selection starts inside or on the node and the user is trying to shift + arrow.
         * For other part of the solution see code in: packages/editor/editor-core/src/plugins/selection/pm-plugins/events/keydown.ts
         */
        keydown: (view, event) => {
          if (
            event instanceof KeyboardEvent &&
            event.shiftKey &&
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
              event.key,
            )
          ) {
            const {
              schema,
              selection,
              selection: { $head },
              doc,
              tr,
            } = view.state;
            const { bodiedExtension } = schema.nodes;

            if (
              selection instanceof TextSelection ||
              selection instanceof NodeSelection
            ) {
              const maybeBodiedExtension =
                selection instanceof TextSelection
                  ? findParentNodeOfTypeClosestToPos($head, bodiedExtension)
                  : findSelectedNodeOfType(bodiedExtension)(selection);

              if (maybeBodiedExtension) {
                const end =
                  maybeBodiedExtension.pos + maybeBodiedExtension.node.nodeSize;

                if (
                  event.key === 'ArrowUp' ||
                  (event.key === 'ArrowLeft' &&
                    isSelectionAtStartOfNode($head, maybeBodiedExtension))
                ) {
                  const anchor = end + 1;

                  // an offset is used here so that left arrow selects the first character before the node (consistent with arrow right)
                  const headOffset = event.key === 'ArrowLeft' ? -1 : 0;
                  const head = maybeBodiedExtension.pos + headOffset;

                  const newSelection = TextSelection.create(
                    doc,
                    Math.max(anchor, selection.anchor),
                    head,
                  );
                  view.dispatch(tr.setSelection(newSelection));
                  return true;
                }

                if (
                  event.key === 'ArrowDown' ||
                  (event.key === 'ArrowRight' &&
                    isSelectionAtEndOfNode($head, maybeBodiedExtension))
                ) {
                  const anchor = maybeBodiedExtension.pos - 1;
                  const head = end + 1;

                  const newSelection = TextSelection.create(
                    doc,
                    Math.min(anchor, selection.anchor),
                    head,
                  );
                  view.dispatch(tr.setSelection(newSelection));
                  return true;
                }
              }
            }
          }
          return false;
        },
      },
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

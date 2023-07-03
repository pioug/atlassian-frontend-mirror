import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';

import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';

import { ProviderHandler } from '@atlaskit/editor-common/provider-factory';
import { BlockCard, BlockCardNodeViewProps } from '../nodeviews/blockCard';
import { EmbedCard, EmbedCardNodeViewProps } from '../nodeviews/embedCard';
import { InlineCardNodeView } from '../nodeviews/inlineCard';
import { CardPluginOptions, CardPluginState } from '../types';
import { pluginKey } from './plugin-key';
import reducer from './reducers';
import { handleProvider, resolveWithProvider } from './util/resolve';
import {
  getNewRequests,
  getPluginState,
  getPluginStateWithUpdatedPos,
} from './util/state';
import { createAnalyticsQueue, eventsFromTransaction } from './analytics';
import type {
  ExtractInjectionAPI,
  PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type cardPlugin from '../index';
import {
  DATASOURCE_INNER_CONTAINER_CLASSNAME,
  Datasource,
} from '../nodeviews/datasource';
import {
  setDatasourceTableRef,
  setCardLayoutAndDatasourceTableRef,
} from './actions';
import { findDomRefAtPos } from 'prosemirror-utils';

export { pluginKey } from './plugin-key';

export const createPlugin =
  (
    options: CardPluginOptions,
    pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined,
  ) =>
  (
    pmPluginFactoryParams: PMPluginFactoryParams,
  ): SafePlugin<CardPluginState> => {
    const { lpAnalyticsEventsNext } = pmPluginFactoryParams.featureFlags;
    const analyticsQueue = createAnalyticsQueue(!!lpAnalyticsEventsNext);

    const {
      editorAppearance,
      platform,
      allowResizing,
      useAlternativePreloader,
      fullWidthMode,
      createAnalyticsEvent,
      showServerActions,
    } = options;
    return new SafePlugin({
      state: {
        init(): CardPluginState {
          return {
            requests: [],
            provider: null,
            cards: [],
            showLinkingToolbar: false,
            smartLinkEvents: undefined,
            smartLinkEventsNext: undefined,
            createAnalyticsEvent,
            editorAppearance,
            datasourceTableRef: undefined,
            layout: undefined,
          };
        },

        apply(tr, pluginState: CardPluginState, prevEditorState: EditorState) {
          // Update all the positions of outstanding requests and
          // cards in the plugin state.
          const pluginStateWithUpdatedPos = getPluginStateWithUpdatedPos(
            pluginState,
            tr,
          );

          // apply any actions
          const meta = tr.getMeta(pluginKey);

          const events = eventsFromTransaction(tr, prevEditorState);
          analyticsQueue.push(...events);

          if (meta) {
            const nextState = reducer(pluginStateWithUpdatedPos, meta);

            if (
              !pluginState.smartLinkEventsNext &&
              nextState.smartLinkEventsNext
            ) {
              analyticsQueue.setCallbacks(nextState.smartLinkEventsNext);
            }

            return nextState;
          }

          return pluginStateWithUpdatedPos;
        },
      },

      view(view: EditorView) {
        const subscriptionHandler: ProviderHandler<'cardProvider'> = (
          name,
          provider,
        ) => handleProvider(name, provider, view);
        const domAtPos = view.domAtPos.bind(view);
        const rafCancellationCallbacks: Function[] = [];

        pmPluginFactoryParams.providerFactory.subscribe(
          'cardProvider',
          subscriptionHandler,
        );

        return {
          update(view: EditorView, prevState: EditorState) {
            const currentState = getPluginState(view.state);
            const oldState = getPluginState(prevState);

            const { state, dispatch } = view;
            const { selection, tr, schema } = state;

            const isBlockCardSelected =
              selection instanceof NodeSelection &&
              selection.node?.type === schema.nodes.blockCard;

            if (isBlockCardSelected) {
              const datasourceTableRef = (
                findDomRefAtPos(selection.from, domAtPos) as HTMLElement
              )?.querySelector(
                `.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`,
              ) as HTMLElement;

              const { node } = selection;
              const isDatasource = !!node?.attrs?.datasource;

              const shouldUpdateTableRef =
                datasourceTableRef &&
                currentState?.datasourceTableRef !== datasourceTableRef;

              if (isDatasource && shouldUpdateTableRef) {
                // since we use the plugin state, which is a shared state, we need to update the datasourceTableRef, layout on each selection
                const layout = node?.attrs?.layout || 'center';

                // we use cardAction to set the same meta, hence, we will need to combine both layout+datasourceTableRef in one transaction
                dispatch(
                  setCardLayoutAndDatasourceTableRef({
                    datasourceTableRef,
                    layout,
                  })(tr),
                );
              }
            } else {
              if (currentState?.datasourceTableRef) {
                dispatch(setDatasourceTableRef(undefined)(tr));
              }
            }

            if (currentState && currentState.provider) {
              // Find requests in this state that weren't in the old one.
              const newRequests = getNewRequests(oldState, currentState);
              // Ask the CardProvider to resolve all new requests.
              const { provider } = currentState;
              newRequests.forEach((request) => {
                /**
                 * Queue each asynchronous resolve request on separate frames.
                 * ---
                 * NB: The promise for each request is queued to take place on separate animation frames. This avoids
                 * the scenario debugged and discovered in EDM-668, wherein the queuing of too many promises in quick succession
                 * leads to the browser's macrotask queue being overwhelmed, locking interactivity of the browser tab.
                 * By using this approach, the browser is free to schedule the resolution of the promises below in between rendering/network/
                 * other tasks as per common implementations of the JavaScript event loop in browsers.
                 */
                const invoke = rafSchedule(() =>
                  resolveWithProvider(
                    view,
                    provider,
                    request,
                    options,
                    pluginInjectionApi?.dependencies.analytics?.actions,
                  ),
                );
                rafCancellationCallbacks.push(invoke.cancel);
                invoke();
              });
            }

            analyticsQueue.flush();
          },

          destroy() {
            // Cancel any outstanding raf callbacks.
            rafCancellationCallbacks.forEach((cancellationCallback) =>
              cancellationCallback(),
            );

            pmPluginFactoryParams.providerFactory.unsubscribe(
              'cardProvider',
              subscriptionHandler,
            );
          },
        };
      },

      props: {
        nodeViews: {
          inlineCard: getInlineNodeViewProducer({
            pmPluginFactoryParams,
            Component: InlineCardNodeView,
            extraComponentProps: { useAlternativePreloader, showServerActions },
          }),
          blockCard: (node, view, getPos) => {
            const { portalProviderAPI, eventDispatcher } =
              pmPluginFactoryParams;
            const reactComponentProps: BlockCardNodeViewProps = {
              platform,
              showServerActions,
            };
            const hasIntlContext = true;
            const isDatasource = !!node?.attrs?.datasource;

            if (isDatasource) {
              return new Datasource({
                node,
                view,
                getPos,
                portalProviderAPI,
                eventDispatcher,
                hasIntlContext,
                pluginInjectionApi,
              }).init();
            }
            return new BlockCard(
              node,
              view,
              getPos,
              portalProviderAPI,
              eventDispatcher,
              reactComponentProps,
              undefined,
              true,
              undefined,
              hasIntlContext,
            ).init();
          },
          embedCard: (node, view, getPos) => {
            const {
              portalProviderAPI,
              eventDispatcher,
              dispatchAnalyticsEvent,
            } = pmPluginFactoryParams;
            const reactComponentProps: EmbedCardNodeViewProps = {
              eventDispatcher,
              allowResizing,
              platform,
              fullWidthMode,
              dispatchAnalyticsEvent,
              pluginInjectionApi,
            };
            const hasIntlContext = true;
            return new EmbedCard(
              node,
              view,
              getPos,
              portalProviderAPI,
              eventDispatcher,
              reactComponentProps,
              undefined,
              true,
              undefined,
              hasIntlContext,
            ).init();
          },
        },
      },

      key: pluginKey,
    });
  };

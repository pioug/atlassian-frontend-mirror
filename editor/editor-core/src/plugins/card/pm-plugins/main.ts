import { Plugin, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { CardPlatform } from '@atlaskit/smart-card';

import { CardPluginState, Request } from '../types';
import reducer from './reducers';
import { setProvider, resolveCard } from './actions';
import { replaceQueuedUrlWithCard } from './doc';
import { PMPluginFactoryParams } from '../../../types';
import { InlineCard } from '../nodeviews/inlineCard';
import { BlockCard } from '../nodeviews/blockCard';
import { EmbedCard } from '../nodeviews/embedCard';
import { pluginKey } from './plugin-key';

export { pluginKey } from './plugin-key';

export const getPluginState = (editorState: EditorState) =>
  pluginKey.getState(editorState) as CardPluginState | undefined;

const handleResolved = (view: EditorView, request: Request) => (
  resolvedCard: any,
) => {
  replaceQueuedUrlWithCard(
    request.url,
    resolvedCard,
    request.analyticsAction,
  )(view.state, view.dispatch);
  return resolvedCard;
};

const handleRejected = (view: EditorView, request: Request) => () => {
  view.dispatch(resolveCard(request.url)(view.state.tr));
};

export type OutstandingRequests = { [key: string]: Promise<string> };

export const resolveWithProvider = (
  view: EditorView,
  outstandingRequests: OutstandingRequests,
  provider: CardProvider,
  request: Request,
) => {
  return (outstandingRequests[request.url] = provider
    .resolve(request.url, request.appearance)
    .then(resolvedCard => {
      delete outstandingRequests[request.url];
      return resolvedCard;
    })
    .then(handleResolved(view, request), handleRejected(view, request)));
};

export const createPlugin = (
  platform: CardPlatform,
  allowResizing?: boolean,
  fullWidthMode?: boolean,
) => ({
  portalProviderAPI,
  eventDispatcher,
  providerFactory,
  dispatchAnalyticsEvent,
}: PMPluginFactoryParams) =>
  new Plugin({
    state: {
      init(): CardPluginState {
        return {
          requests: [],
          provider: null,
          cards: [],
          showLinkingToolbar: false,
        };
      },

      apply(tr, pluginState: CardPluginState) {
        // update all the positions
        const remappedState = {
          ...pluginState,
          requests: pluginState.requests.map(request => ({
            ...request,
            pos: tr.mapping.map(request.pos),
          })),

          cards: pluginState.cards.map(card => ({
            ...card,
            pos: tr.mapping.map(card.pos),
          })),
        };

        // apply any actions
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const nextPluginState = reducer(remappedState, meta);
          return nextPluginState;
        }

        return remappedState;
      },
    },

    view(view: EditorView) {
      // listen for card provider changes
      const handleProvider = (
        _: 'cardProvider',
        provider?: Promise<CardProvider>,
      ) => {
        if (!provider) {
          return;
        }

        provider.then((cardProvider: CardProvider) => {
          const { state, dispatch } = view;
          dispatch(setProvider(cardProvider)(state.tr));
        });
      };

      providerFactory.subscribe('cardProvider', handleProvider);
      const outstandingRequests: OutstandingRequests = {};

      return {
        update(view: EditorView, prevState: EditorState) {
          const currentState = getPluginState(view.state);
          const oldState = getPluginState(prevState);

          if (currentState && currentState.provider) {
            // find requests in this state that weren't in the old one
            const newRequests = oldState
              ? currentState.requests.filter(
                  req =>
                    !oldState.requests.find(
                      oldReq =>
                        oldReq.url === req.url && oldReq.pos === req.pos,
                    ),
                )
              : currentState.requests;

            // ask the CardProvider to resolve all new requests
            const { provider } = currentState;
            newRequests.forEach(request => {
              resolveWithProvider(view, outstandingRequests, provider, request);
            });
          }
        },

        destroy() {
          // cancel all outstanding requests
          Object.keys(outstandingRequests).forEach(url =>
            Promise.reject(outstandingRequests[url]),
          );

          providerFactory.unsubscribe('cardProvider', handleProvider);
        },
      };
    },

    props: {
      nodeViews: {
        inlineCard: (node, view, getPos) => {
          return new InlineCard(
            node,
            view,
            getPos,
            portalProviderAPI,
            eventDispatcher,
            {
              providerFactory,
            },
            undefined,
            true,
          ).init();
        },
        blockCard: (node, view, getPos) => {
          return new BlockCard(
            node,
            view,
            getPos,
            portalProviderAPI,
            eventDispatcher,
            {
              providerFactory,
              platform,
            },
            undefined,
            true,
          ).init();
        },
        embedCard: (node, view, getPos) => {
          return new EmbedCard(
            node,
            view,
            getPos,
            portalProviderAPI,
            eventDispatcher,
            {
              eventDispatcher,
              providerFactory,
              platform,
              allowResizing,
              fullWidthMode: fullWidthMode,
              dispatchAnalyticsEvent,
            },
            undefined,
            true,
          ).init();
        },
      },
    },

    key: pluginKey,
  });

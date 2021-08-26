import { Plugin, StateField } from 'prosemirror-state';
import {
  SLI_EVENT_TYPE,
  SMART_EVENT_TYPE,
  buildSliPayload,
  MentionProvider,
} from '@atlaskit/mention/resource';
import {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common';

import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import mentionNodeView from '../nodeviews/mention';
import { mentionPluginKey } from './key';

import type { Command } from '../../../types';
import type { MentionPluginOptions, MentionPluginState } from '../types';

const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_CONTEXT: 'SET_CONTEXT',
};

const setProvider = (provider: MentionProvider | undefined): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(mentionPluginKey, {
        action: ACTIONS.SET_PROVIDER,
        params: { provider },
      }),
    );
  }
  return true;
};

export const setContext = (
  context: ContextIdentifierProvider | undefined,
): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(mentionPluginKey, {
        action: ACTIONS.SET_CONTEXT,
        params: { context },
      }),
    );
  }
  return true;
};

export function createMentionPlugin(
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  fireEvent: (payload: any) => void,
  options?: MentionPluginOptions,
) {
  let mentionProvider: MentionProvider;

  const sendAnalytics = (
    event: string,
    actionSubject: string,
    action: string,
    attributes?: {
      [key: string]: any;
    },
  ): void => {
    if (event === SLI_EVENT_TYPE || event === SMART_EVENT_TYPE) {
      fireEvent(buildSliPayload(actionSubject, action, attributes));
    }
  };

  return new Plugin({
    key: mentionPluginKey,
    state: {
      init() {
        return {};
      },
      apply(tr, pluginState) {
        const { action, params } = tr.getMeta(mentionPluginKey) || {
          action: null,
          params: null,
        };

        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = {
              ...pluginState,
              mentionProvider: params.provider,
            };
            dispatch(mentionPluginKey, newPluginState);

            return newPluginState;
          case ACTIONS.SET_CONTEXT:
            newPluginState = {
              ...pluginState,
              contextIdentifierProvider: params.context,
            };
            dispatch(mentionPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      },
    } as StateField<MentionPluginState>,
    props: {
      nodeViews: {
        mention: mentionNodeView(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
          options,
        ),
      },
    },
    view(editorView) {
      const providerHandler = (
        name: string,
        providerPromise?: Promise<MentionProvider | ContextIdentifierProvider>,
      ) => {
        switch (name) {
          case 'mentionProvider':
            if (!providerPromise) {
              return setProvider(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }

            (providerPromise as Promise<MentionProvider>)
              .then((provider) => {
                if (mentionProvider) {
                  mentionProvider.unsubscribe('mentionPlugin');
                }

                mentionProvider = provider;
                setProvider(provider)(editorView.state, editorView.dispatch);

                provider.subscribe(
                  'mentionPlugin',
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  sendAnalytics,
                );
              })
              .catch(() =>
                setProvider(undefined)(editorView.state, editorView.dispatch),
              );
            break;

          case 'contextIdentifierProvider':
            if (!providerPromise) {
              return setContext(undefined)(
                editorView.state,
                editorView.dispatch,
              );
            }
            (providerPromise as Promise<ContextIdentifierProvider>).then(
              (provider) => {
                setContext(provider)(editorView.state, editorView.dispatch);
              },
            );
            break;
        }
        return;
      };

      providerFactory.subscribe('mentionProvider', providerHandler);
      providerFactory.subscribe('contextIdentifierProvider', providerHandler);

      return {
        destroy() {
          if (providerFactory) {
            providerFactory.unsubscribe('mentionProvider', providerHandler);
            providerFactory.unsubscribe(
              'contextIdentifierProvider',
              providerHandler,
            );
          }
          if (mentionProvider) {
            mentionProvider.unsubscribe('mentionPlugin');
          }
        },
      };
    },
  });
}

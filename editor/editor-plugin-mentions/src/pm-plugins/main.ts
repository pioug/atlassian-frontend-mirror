import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  Command,
  PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type {
  EditorState,
  SafeStateField,
} from '@atlaskit/editor-prosemirror/state';
import type { MentionProvider } from '@atlaskit/mention/resource';
import {
  buildSliPayload,
  SLI_EVENT_TYPE,
  SMART_EVENT_TYPE,
} from '@atlaskit/mention/resource';

import { MentionNodeView } from '../nodeviews/mention';
import type { MentionPluginOptions, MentionPluginState } from '../types';

import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_CONTEXT: 'SET_CONTEXT',
};

const setProvider =
  (provider: MentionProvider | undefined): Command =>
  (state, dispatch) => {
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

export const setContext =
  (context: ContextIdentifierProvider | undefined): Command =>
  (state, dispatch) => {
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
  pmPluginFactoryParams: PMPluginFactoryParams,
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

  return new SafePlugin({
    key: mentionPluginKey,
    state: {
      init(_, state: EditorState): MentionPluginState {
        const canInsertMention = canMentionBeCreatedInRange(
          state.selection.from,
          state.selection.to,
        )(state);
        return {
          canInsertMention,
        };
      },
      apply(
        tr,
        pluginState: MentionPluginState,
        oldState,
        newState,
      ): MentionPluginState {
        const { action, params } = tr.getMeta(mentionPluginKey) || {
          action: null,
          params: null,
        };
        let hasNewPluginState = false;
        let newPluginState = pluginState;

        const hasPositionChanged =
          oldState.selection.from !== newState.selection.from ||
          oldState.selection.to !== newState.selection.to;

        if (tr.docChanged || (tr.selectionSet && hasPositionChanged)) {
          newPluginState = {
            ...pluginState,
            canInsertMention: canMentionBeCreatedInRange(
              newState.selection.from,
              newState.selection.to,
            )(newState),
          };
          hasNewPluginState = true;
        }

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = {
              ...newPluginState,
              mentionProvider: params.provider,
            };
            hasNewPluginState = true;
            break;
          case ACTIONS.SET_CONTEXT:
            newPluginState = {
              ...newPluginState,
              contextIdentifierProvider: params.context,
            };
            hasNewPluginState = true;
            break;
        }

        if (hasNewPluginState) {
          pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
        }
        return newPluginState;
      },
    } as SafeStateField<MentionPluginState>,
    props: {
      nodeViews: {
        mention: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: MentionNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory,
            options,
          },
        }),
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
              .then(provider => {
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
              provider => {
                setContext(provider)(editorView.state, editorView.dispatch);
              },
            );
            break;
        }
        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe(
        'mentionProvider',
        providerHandler,
      );
      pmPluginFactoryParams.providerFactory.subscribe(
        'contextIdentifierProvider',
        providerHandler,
      );

      return {
        destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe(
              'mentionProvider',
              providerHandler,
            );
            pmPluginFactoryParams.providerFactory.unsubscribe(
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

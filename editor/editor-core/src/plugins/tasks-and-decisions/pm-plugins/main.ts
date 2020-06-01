import { EditorView } from 'prosemirror-view';
import { Plugin, NodeSelection } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { uuid } from '@atlaskit/adf-schema';
import {
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { decisionItemNodeView } from '../nodeviews/decisionItem';
import { taskItemNodeViewFactory } from '../nodeviews/taskItem';
import { Command } from '../../../types';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { nodesBetweenChanged } from '../../../utils';
import { stateKey } from './plugin-key';

enum ACTIONS {
  SET_CONTEXT_PROVIDER,
}

export interface TaskDecisionPluginState {
  currentTaskDecisionItem: PMNode | undefined;
  contextIdentifierProvider?: ContextIdentifierProvider;
}

const setContextIdentifierProvider = (
  provider: ContextIdentifierProvider | undefined,
): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr.setMeta(stateKey, {
        action: ACTIONS.SET_CONTEXT_PROVIDER,
        data: provider,
      }),
    );
  }
  return true;
};

export function createPlugin(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  dispatch: Dispatch,
) {
  return new Plugin({
    props: {
      nodeViews: {
        taskItem: taskItemNodeViewFactory(
          portalProviderAPI,
          eventDispatcher,
          providerFactory,
        ),
        decisionItem: decisionItemNodeView(portalProviderAPI, eventDispatcher),
      },
      handleTextInput(
        view: EditorView,
        from: number,
        to: number,
        text: string,
      ) {
        // When a decision item is selected and the user starts typing, the entire node
        // should be replaced with what was just typed. This custom text input handler
        // is needed to implement that behaviour.

        // TODO: ProseMirror should already do this by default
        // Tech debt to investigate why we need a custom handler here:
        // https://product-fabric.atlassian.net/browse/ED-9278

        const { state, dispatch } = view;
        const { tr } = state;
        if (state.selection instanceof NodeSelection) {
          state.selection.replace(tr);
          tr.insertText(text);
          if (dispatch) {
            dispatch(tr);
          }
          return true;
        }
        return false;
      },
    },
    state: {
      init() {
        return { insideTaskDecisionItem: false };
      },
      apply(tr, pluginState) {
        const { action, data } = tr.getMeta(stateKey) || {
          action: null,
          data: null,
        };
        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_CONTEXT_PROVIDER:
            newPluginState = {
              ...pluginState,
              contextIdentifierProvider: data,
            };
            break;
        }

        dispatch(stateKey, newPluginState);
        return newPluginState;
      },
    },
    view(editorView) {
      const providerHandler = (
        name: string,
        providerPromise?: Promise<ContextIdentifierProvider>,
      ) => {
        if (name === 'contextIdentifierProvider') {
          if (!providerPromise) {
            setContextIdentifierProvider(undefined)(
              editorView.state,
              editorView.dispatch,
            );
          } else {
            (providerPromise as Promise<ContextIdentifierProvider>).then(
              provider => {
                setContextIdentifierProvider(provider)(
                  editorView.state,
                  editorView.dispatch,
                );
              },
            );
          }
        }
      };
      providerFactory.subscribe('contextIdentifierProvider', providerHandler);

      return {};
    },
    key: stateKey,
    /*
     * After each transaction, we search through the document for any decisionList/Item & taskList/Item nodes
     * that do not have the localId attribute set and generate a random UUID to use. This is to replace a previous
     * Prosemirror capabibility where node attributes could be generated dynamically.
     * See https://discuss.prosemirror.net/t/release-0-23-0-possibly-to-be-1-0-0/959/17 for a discussion of this approach.
     *
     * Note: we currently do not handle the edge case where two nodes may have the same localId
     */
    appendTransaction: (transactions, _oldState, newState) => {
      const tr = newState.tr;
      let modified = false;
      transactions.forEach(transaction => {
        if (!transaction.docChanged) {
          return;
        }

        // Adds a unique id to a node
        nodesBetweenChanged(transaction, (node, pos) => {
          const {
            decisionList,
            decisionItem,
            taskList,
            taskItem,
          } = newState.schema.nodes;
          if (
            !!node.type &&
            (node.type === decisionList ||
              node.type === decisionItem ||
              node.type === taskList ||
              node.type === taskItem)
          ) {
            const { localId, ...rest } = node.attrs;
            if (localId === undefined || localId === null || localId === '') {
              tr.setNodeMarkup(pos, undefined, {
                localId: uuid.generate(),
                ...rest,
              });
              modified = true;
            }
          }
        });
      });

      if (modified) {
        return tr.setMeta('addToHistory', false);
      }
      return;
    },
  });
}

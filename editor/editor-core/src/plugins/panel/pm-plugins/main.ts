import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { panelNodeView } from '../nodeviews/panel';
import { Command, PMPluginFactoryParams } from '../../../types';

export type PanelState = {
  element?: HTMLElement;
  activePanelType?: string | undefined;
  toolbarVisible?: boolean | undefined;
};

export const getPluginState = (state: EditorState): PanelState => {
  return pluginKey.getState(state);
};

export const setPluginState = (stateProps: Object): Command => (
  state,
  dispatch,
) => {
  const pluginState = getPluginState(state);
  if (dispatch) {
    dispatch(
      state.tr.setMeta(pluginKey, {
        ...pluginState,
        ...stateProps,
      }),
    );
  }
  return true;
};

export type PanelStateSubscriber = (state: PanelState) => any;

export const pluginKey = new PluginKey('panelPlugin');

export const createPlugin = ({ dispatch }: PMPluginFactoryParams) =>
  new Plugin({
    state: {
      init() {
        return {
          element: null,
          activePanelType: undefined,
          toolbarVisible: false,
        };
      },
      apply(tr, pluginState: PanelState) {
        const maybeNextPluginState = tr.getMeta(pluginKey);
        if (maybeNextPluginState) {
          const nextPluginState = { ...pluginState, ...maybeNextPluginState };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    view: () => {
      return {
        update: view => {
          const {
            state: {
              selection,
              schema: {
                nodes: { panel },
              },
            },
          } = view;
          const pluginState = getPluginState(view.state);
          const parent = findParentNodeOfType(panel)(selection);
          const parentDOM = findParentDomRefOfType(
            panel,
            view.domAtPos.bind(view),
          )(selection);
          if (parentDOM !== pluginState.element) {
            setPluginState({
              element: parentDOM,
              activePanelType: parent && parent!.node.attrs['panelType'],
              toolbarVisible: !!parent,
            })(view.state, view.dispatch);
            return true;
          }

          /** Plugin dispatch needed to reposition the toolbar */
          dispatch(pluginKey, {
            ...pluginState,
          });
          return;
        },
      };
    },
    props: {
      nodeViews: {
        panel: panelNodeView(),
      },
      handleDOMEvents: {
        blur(view) {
          const pluginState = getPluginState(view.state);
          if (pluginState.toolbarVisible) {
            setPluginState({
              toolbarVisible: false,
              element: null,
              activePanelType: undefined,
            })(view.state, view.dispatch);
            return true;
          }
          return false;
        },
      },
    },
  });

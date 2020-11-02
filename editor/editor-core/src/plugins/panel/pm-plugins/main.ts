import { EditorState, Plugin } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

import {
  PanelSharedCssClassName,
  ProviderFactory,
} from '@atlaskit/editor-common';

import { getPanelNodeView } from '../nodeviews/panel';
import { Command } from '../../../types';
import { PanelPluginOptions, pluginKey } from '../types';
import { findPanel } from '../utils';
import { Dispatch } from '../../../event-dispatcher';
import { createSelectionClickHandler } from '../../selection/utils';

export type PanelState = {
  element?: HTMLElement;
  activePanelType?: string;
  activePanelColor?: string;
  activePanelIcon?: string;
  toolbarVisible?: boolean;
};

export type PanelOptions = {
  color?: string;
  emoji?: string;
};

export const getPluginState = (state: EditorState): PanelState => {
  return pluginKey.getState(state);
};

export const setPluginState = (stateProps: PanelState): Command => (
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

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  pluginOptions: PanelPluginOptions,
) => {
  const { useLongPressSelection = false } = pluginOptions;
  return new Plugin({
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
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: view => {
          const pluginState = getPluginState(view.state);
          const panelNode = findPanel(view.state, view.state.selection);
          const panelRef = panelNode
            ? (findDomRefAtPos(panelNode.pos, domAtPos) as HTMLDivElement)
            : undefined;

          if (panelRef !== pluginState.element) {
            const newState: PanelState = {
              element: panelRef,
              activePanelType: panelRef && panelNode?.node.attrs['panelType'],
              activePanelColor: pluginOptions.UNSAFE_allowCustomPanel
                ? panelRef && panelNode?.node.attrs['panelColor']
                : undefined,
              activePanelIcon: pluginOptions.UNSAFE_allowCustomPanel
                ? panelRef && panelNode?.node.attrs['panelIcon']
                : undefined,
              toolbarVisible: !!panelRef,
            };
            setPluginState(newState)(view.state, view.dispatch);
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
        panel: getPanelNodeView(pluginOptions, providerFactory),
      },
      handleClickOn: createSelectionClickHandler(
        ['panel'],
        target => !!target.closest(`.${PanelSharedCssClassName.prefix}`),
        { useLongPressSelection },
      ),
      handleDOMEvents: {
        blur(view) {
          const pluginState = getPluginState(view.state);
          if (pluginState.toolbarVisible) {
            setPluginState({
              element: undefined,
              activePanelType: undefined,
              activePanelColor: undefined,
              activePanelIcon: undefined,
              toolbarVisible: false,
            })(view.state, view.dispatch);
            return true;
          }
          return false;
        },
      },
    },
  });
};

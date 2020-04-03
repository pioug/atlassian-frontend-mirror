import React from 'react';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';
import {
  Plugin,
  PluginKey,
  Selection,
  EditorState,
  Transaction,
} from 'prosemirror-state';
import { findDomRefAtPos, findSelectedNodeOfType } from 'prosemirror-utils';
import { Popup, ProviderFactory } from '@atlaskit/editor-common';
import { Node } from 'prosemirror-model';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { ToolbarLoader } from './ui/ToolbarLoader';
import { FloatingToolbarHandler, FloatingToolbarConfig } from './types';

import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../editor-disabled';

type ConfigWithNodeInfo = {
  config: FloatingToolbarConfig | undefined;
  pos: number;
  node: Node;
};

export const getRelevantConfig = (
  selection: Selection<any>,
  configs: Array<FloatingToolbarConfig>,
): ConfigWithNodeInfo | undefined => {
  // node selections always take precedence, see if
  let configPair: ConfigWithNodeInfo | undefined;
  configs.find(config => {
    const node = findSelectedNodeOfType(config.nodeType)(selection);
    if (node) {
      configPair = {
        node: node.node,
        pos: node.pos,
        config,
      };
    }

    return !!node;
  });

  if (configPair) {
    return configPair;
  }

  // create mapping of node type name to configs
  const configByNodeType: Record<string, FloatingToolbarConfig> = {};
  configs.forEach(config => {
    if (Array.isArray(config.nodeType)) {
      config.nodeType.forEach(nodeType => {
        configByNodeType[nodeType.name] = config;
      });
    } else {
      configByNodeType[config.nodeType.name] = config;
    }
  });

  // search up the tree from selection
  const { $from } = selection;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);

    const matchedConfig = configByNodeType[node.type.name];
    if (matchedConfig) {
      return { config: matchedConfig, node: node, pos: $from.pos };
    }
  }

  return;
};

const getDomRefFromSelection = (view: EditorView) =>
  findDomRefAtPos(
    view.state.selection.from,
    view.domAtPos.bind(view),
  ) as HTMLElement;

function filterUndefined<T>(x?: T): x is T {
  return !!x;
}

const floatingToolbarPlugin = (): EditorPlugin => ({
  name: 'floatingToolbar',

  pmPlugins(floatingToolbarHandlers: Array<FloatingToolbarHandler> = []) {
    return [
      {
        // Should be after all toolbar plugins
        name: 'floatingToolbar',
        plugin: ({ dispatch, reactContext, providerFactory }) =>
          floatingToolbarPluginFactory({
            dispatch,
            floatingToolbarHandlers,
            reactContext,
            providerFactory,
          }),
      },
    ];
  },

  contentComponent({
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    editorView,
    providerFactory,
    dispatchAnalyticsEvent,
  }) {
    return (
      <WithPluginState
        plugins={{
          floatingToolbarState: pluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
        }}
        render={({
          editorDisabledPlugin,
          floatingToolbarState,
        }: {
          floatingToolbarState?: ConfigWithNodeInfo;
          editorDisabledPlugin: EditorDisabledPluginState;
        }) => {
          if (
            !floatingToolbarState ||
            !floatingToolbarState.config ||
            (typeof floatingToolbarState.config.visible !== 'undefined' &&
              !floatingToolbarState.config.visible)
          ) {
            return null;
          }

          const {
            title,
            getDomRef = getDomRefFromSelection,
            items,
            align = 'center',
            className = '',
            height,
            width,
            offset = [0, 12],
            forcePlacement,
          } = floatingToolbarState.config;
          const targetRef = getDomRef(editorView);

          if (
            !targetRef ||
            (editorDisabledPlugin && editorDisabledPlugin.editorDisabled)
          ) {
            return null;
          }
          const toolbarItems = Array.isArray(items)
            ? items
            : items(floatingToolbarState.node);
          return (
            <Popup
              ariaLabel={title}
              offset={offset}
              target={targetRef}
              alignY="bottom"
              forcePlacement={forcePlacement}
              fitHeight={height}
              fitWidth={width}
              alignX={align}
              stick={true}
              mountTo={popupsMountPoint}
              boundariesElement={popupsBoundariesElement}
              scrollableElement={popupsScrollableElement}
            >
              <ToolbarLoader
                target={targetRef}
                items={toolbarItems}
                node={floatingToolbarState.node}
                dispatchCommand={(fn?: Function) =>
                  fn && fn(editorView.state, editorView.dispatch)
                }
                editorView={editorView}
                className={className}
                focusEditor={() => editorView.focus()}
                providerFactory={providerFactory}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                popupsScrollableElement={popupsScrollableElement}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              />
            </Popup>
          );
        }}
      />
    );
  },
});

export default floatingToolbarPlugin;

/**
 *
 * ProseMirror Plugin
 *
 */

// We throttle update of this plugin with RAF.
// So from other plugins you will always get the previous state.
// To prevent the confusion we are not exporting the plugin key.
const pluginKey = new PluginKey('floatingToolbarPluginKey');

/**
 * Clean up floating toolbar configs from undesired properties.
 */
function sanitizeFloatingToolbarConfig(
  config: FloatingToolbarConfig,
): FloatingToolbarConfig {
  // Cleanup from non existing node types
  if (Array.isArray(config.nodeType)) {
    return {
      ...config,
      nodeType: config.nodeType.filter(filterUndefined),
    };
  }

  return config;
}

function floatingToolbarPluginFactory(options: {
  floatingToolbarHandlers: Array<FloatingToolbarHandler>;
  dispatch: Dispatch<ConfigWithNodeInfo | undefined>;
  reactContext: () => { [key: string]: any };
  providerFactory: ProviderFactory;
}) {
  const {
    floatingToolbarHandlers,
    dispatch,
    reactContext,
    providerFactory,
  } = options;

  const apply = (
    _tr: Transaction,
    _pluginState: any,
    _oldState: EditorState<any>,
    newState: EditorState<any>,
  ) => {
    const { intl } = reactContext();
    const activeConfigs = floatingToolbarHandlers
      .map(handler => handler(newState, intl, providerFactory))
      .filter(filterUndefined)
      .map(config => sanitizeFloatingToolbarConfig(config));

    const relevantConfig =
      activeConfigs && getRelevantConfig(newState.selection, activeConfigs);

    dispatch(pluginKey, relevantConfig);
    return relevantConfig;
  };

  const rafApply = rafSchedule(apply);

  return new Plugin({
    key: pluginKey,
    state: {
      init: () => {
        ToolbarLoader.preload();
      },
      apply: rafApply,
    },
    view: () => ({
      destroy: () => {
        rafApply.cancel();
      },
    }),
  });
}

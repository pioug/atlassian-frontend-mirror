import React from 'react';
import { EditorView } from 'prosemirror-view';
import {
  Plugin,
  PluginKey,
  Selection,
  EditorState,
  Transaction,
  AllSelection,
} from 'prosemirror-state';
import { findDomRefAtPos, findSelectedNodeOfType } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import camelCase from 'lodash/camelCase';
import { Popup, ProviderFactory } from '@atlaskit/editor-common';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import {
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
  CONTENT_COMPONENT,
  FLOATING_CONTROLS_TITLE,
} from '../analytics/types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import { pluginKey as extensionsPluginKey } from '../extension/plugin-key';
import { pluginKey as editorDisabledPluginKey } from '../editor-disabled';
import { pluginKey as dataPluginKey } from './pm-plugins/toolbar-data/plugin-key';
import { createPlugin as floatingToolbarDataPluginFactory } from './pm-plugins/toolbar-data/plugin';
import { hideConfirmDialog } from './pm-plugins/toolbar-data/commands';

import { ConfirmationModal } from './ui/ConfirmationModal';
import { ToolbarLoader } from './ui/ToolbarLoader';
import {
  FloatingToolbarHandler,
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from './types';
import { findNode } from './utils';
import { ErrorBoundary } from '../../ui/ErrorBoundary';

export type FloatingToolbarPluginState = Record<
  'getConfigWithNodeInfo',
  (state: EditorState) => ConfigWithNodeInfo | null | undefined
>;
export type ConfigWithNodeInfo = {
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
  configs.find((config) => {
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
  configs.forEach((config) => {
    if (Array.isArray(config.nodeType)) {
      config.nodeType.forEach((nodeType) => {
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

  // if it is AllSelection (can be result of Cmd+A) - use first node
  if (selection instanceof AllSelection) {
    const docNode = $from.node(0);

    let matchedConfig: FloatingToolbarConfig | null = null;
    const firstChild = findNode(docNode, (node) => {
      matchedConfig = configByNodeType[node.type.name];
      return !!matchedConfig;
    });
    if (firstChild && matchedConfig) {
      return { config: matchedConfig, node: firstChild, pos: $from.pos };
    }
  }

  return;
};

const getDomRefFromSelection = (
  view: EditorView,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
  try {
    return findDomRefAtPos(
      view.state.selection.from,
      view.domAtPos.bind(view),
    ) as HTMLElement;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
    if (dispatchAnalyticsEvent) {
      const payload: AnalyticsEventPayload = {
        action: ACTION.ERRORED,
        actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: CONTENT_COMPONENT.FLOATING_TOOLBAR,
          selection: view.state.selection.toJSON(),
          position: view.state.selection.from,
          docSize: view.state.doc.nodeSize,
          error: error.toString(),
          errorStack: error.stack || undefined,
        },
      };
      dispatchAnalyticsEvent(payload);
    }
  }
};

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
            floatingToolbarHandlers,
            dispatch,
            reactContext,
            providerFactory,
          }),
      },
      {
        name: 'floatingToolbarData',
        plugin: ({ dispatch }) => floatingToolbarDataPluginFactory(dispatch),
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
          floatingToolbarData: dataPluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
          extensionsState: extensionsPluginKey,
        }}
        render={({
          editorDisabledPlugin,
          floatingToolbarState,
          floatingToolbarData,
          extensionsState,
        }) => {
          const configWithNodeInfo = floatingToolbarState?.getConfigWithNodeInfo(
            editorView.state,
          );
          if (
            !configWithNodeInfo ||
            !configWithNodeInfo.config ||
            (typeof configWithNodeInfo.config?.visible !== 'undefined' &&
              !configWithNodeInfo.config?.visible)
          ) {
            return null;
          }

          const { config, node } = configWithNodeInfo;
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
            onPositionCalculated,
          } = config;
          const targetRef = getDomRef(editorView, dispatchAnalyticsEvent);

          if (
            !targetRef ||
            (editorDisabledPlugin && editorDisabledPlugin.editorDisabled)
          ) {
            return null;
          }

          let customPositionCalculation;
          const toolbarItems = Array.isArray(items) ? items : items(node);

          if (onPositionCalculated) {
            customPositionCalculation = (nextPos: Position): Position => {
              return onPositionCalculated(editorView, nextPos);
            };
          }

          const dispatchCommand = (fn?: Function) =>
            fn && fn(editorView.state, editorView.dispatch, editorView);

          // Confirm dialog
          const { confirmDialogForItem } = floatingToolbarData || {};
          const confirmButtonItem = confirmDialogForItem
            ? (toolbarItems[confirmDialogForItem] as FloatingToolbarButton<
                Function
              >)
            : undefined;

          return (
            <ErrorBoundary
              component={ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN}
              componentId={camelCase(title) as FLOATING_CONTROLS_TITLE}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              fallbackComponent={null}
            >
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
                onPositionCalculated={customPositionCalculation}
              >
                <ToolbarLoader
                  target={targetRef}
                  items={toolbarItems}
                  node={node}
                  dispatchCommand={dispatchCommand}
                  editorView={editorView}
                  className={className}
                  focusEditor={() => editorView.focus()}
                  providerFactory={providerFactory}
                  popupsMountPoint={popupsMountPoint}
                  popupsBoundariesElement={popupsBoundariesElement}
                  popupsScrollableElement={popupsScrollableElement}
                  dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                  extensionsProvider={extensionsState?.extensionProvider}
                />
              </Popup>

              <ConfirmationModal
                options={confirmButtonItem?.confirmDialog}
                onConfirm={() => {
                  dispatchCommand(confirmButtonItem!.onClick);
                  dispatchCommand(hideConfirmDialog());
                }}
                // When closed without clicking OK or cancel buttons
                onClose={() => {
                  dispatchCommand(hideConfirmDialog());
                }}
              />
            </ErrorBoundary>
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
export const pluginKey = new PluginKey<FloatingToolbarPluginState>(
  'floatingToolbarPluginKey',
);

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
  dispatch: Dispatch<FloatingToolbarPluginState>;
  reactContext: () => { [key: string]: any };
  providerFactory: ProviderFactory;
}) {
  const {
    floatingToolbarHandlers,
    dispatch,
    reactContext,
    providerFactory,
  } = options;
  const { intl } = reactContext();
  const getConfigWithNodeInfo = (editorState: EditorState) => {
    const activeConfigs = floatingToolbarHandlers
      .map((handler) => handler(editorState, intl, providerFactory))
      .filter(filterUndefined)
      .map((config) => sanitizeFloatingToolbarConfig(config));

    const relevantConfig =
      activeConfigs && getRelevantConfig(editorState.selection, activeConfigs);
    return relevantConfig;
  };

  const apply = (tr: Transaction, pluginState: any) => {
    const newPluginState = { getConfigWithNodeInfo };
    dispatch(pluginKey, newPluginState);
    return newPluginState;
  };

  return new Plugin({
    key: pluginKey,
    state: {
      init: () => {
        // Use this point to preload the UI
        ToolbarLoader.preload();
        return { getConfigWithNodeInfo };
      },
      apply,
    },
  });
}

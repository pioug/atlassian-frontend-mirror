import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  Selection,
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey, AllSelection } from '@atlaskit/editor-prosemirror/state';
import {
  findDomRefAtPos,
  findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import camelCase from 'lodash/camelCase';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Popup } from '@atlaskit/editor-common/ui';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type {
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
  FLOATING_CONTROLS_TITLE,
} from '../analytics/types';
import { CONTENT_COMPONENT } from '../analytics/types';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { pluginKey as dataPluginKey } from './pm-plugins/toolbar-data/plugin-key';
import { createPlugin as floatingToolbarDataPluginFactory } from './pm-plugins/toolbar-data/plugin';
import { hideConfirmDialog } from './pm-plugins/toolbar-data/commands';

import { ConfirmationModal } from './ui/ConfirmationModal';
import { ToolbarLoader } from './ui/ToolbarLoader';
import type {
  ExtractInjectionAPI,
  FloatingToolbarHandler,
  FloatingToolbarConfig,
  FloatingToolbarButton,
  UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { findNode } from './utils';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { IntlShape } from 'react-intl-next';
import forceFocusPlugin, { forceFocusSelector } from './pm-plugins/force-focus';
import type {
  FloatingToolbarPlugin,
  ConfigWithNodeInfo,
  FloatingToolbarPluginState,
} from '@atlaskit/editor-plugin-floating-toolbar';

export const getRelevantConfig = (
  selection: Selection,
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
  } catch (error: any) {
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

const floatingToolbarPlugin: FloatingToolbarPlugin = ({ api }) => {
  return {
    name: 'floatingToolbar',

    pmPlugins(floatingToolbarHandlers: Array<FloatingToolbarHandler> = []) {
      return [
        {
          // Should be after all toolbar plugins
          name: 'floatingToolbar',
          plugin: ({ dispatch, providerFactory, getIntl }) =>
            floatingToolbarPluginFactory({
              floatingToolbarHandlers,
              dispatch,
              providerFactory,
              getIntl,
            }),
        },
        {
          name: 'floatingToolbarData',
          plugin: ({ dispatch }) => floatingToolbarDataPluginFactory(dispatch),
        },
        {
          name: 'forceFocus',
          plugin: () => forceFocusPlugin(),
        },
      ];
    },

    actions: {
      forceFocusSelector,
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }

      const configWithNodeInfo =
        pluginKey.getState(editorState)?.getConfigWithNodeInfo?.(editorState) ??
        undefined;

      return {
        configWithNodeInfo,
        floatingToolbarData: dataPluginKey.getState(editorState),
      };
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
        <ContentComponent
          editorView={editorView}
          pluginInjectionApi={api}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
          providerFactory={providerFactory}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        />
      );
    },
  };
};

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

function ContentComponent({
  pluginInjectionApi,
  editorView,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  providerFactory,
  dispatchAnalyticsEvent,
}: Pick<
  UiComponentFactoryParams,
  | 'editorView'
  | 'popupsMountPoint'
  | 'popupsBoundariesElement'
  | 'providerFactory'
  | 'dispatchAnalyticsEvent'
  | 'popupsScrollableElement'
> & {
  pluginInjectionApi: ExtractInjectionAPI<FloatingToolbarPlugin> | undefined;
}) {
  const featureFlags =
    pluginInjectionApi?.featureFlags?.sharedState.currentState() || {};
  const { floatingToolbarState, editorDisabledState } = useSharedPluginState(
    pluginInjectionApi,
    ['floatingToolbar', 'editorDisabled'],
  );

  const { configWithNodeInfo, floatingToolbarData } =
    floatingToolbarState ?? {};

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
    zIndex,
    offset = [0, 12],
    forcePlacement,
    preventPopupOverflow,
    onPositionCalculated,
    absoluteOffset = { top: 0, left: 0, right: 0, bottom: 0 },
    focusTrap,
  } = config;
  const targetRef = getDomRef(editorView, dispatchAnalyticsEvent);

  if (
    !targetRef ||
    (editorDisabledState && editorDisabledState.editorDisabled)
  ) {
    return null;
  }

  let customPositionCalculation;
  const toolbarItems =
    pluginInjectionApi?.copyButton.actions.processCopyButtonItems(
      editorView.state,
    )(
      Array.isArray(items) ? items : items(node),
      pluginInjectionApi?.decorations.actions.hoverDecoration,
    );

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
    ? (toolbarItems![confirmDialogForItem] as FloatingToolbarButton<Function>)
    : undefined;

  const scrollable = config.scrollable;

  const confirmDialogOptions =
    typeof confirmButtonItem?.confirmDialog === 'function'
      ? confirmButtonItem?.confirmDialog()
      : confirmButtonItem?.confirmDialog;

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
        absoluteOffset={absoluteOffset}
        alignX={align}
        stick={true}
        zIndex={zIndex}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        onPositionCalculated={customPositionCalculation}
        style={scrollable ? { maxWidth: '100%' } : {}}
        focusTrap={focusTrap}
        preventOverflow={preventPopupOverflow}
      >
        <WithProviders
          providerFactory={providerFactory}
          providers={['extensionProvider']}
          renderNode={(providers) => {
            return (
              <ToolbarLoader
                target={targetRef}
                items={toolbarItems!}
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
                extensionsProvider={providers.extensionProvider}
                scrollable={scrollable}
                featureFlags={featureFlags}
                api={pluginInjectionApi}
              />
            );
          }}
        />
      </Popup>

      <ConfirmationModal
        testId="ak-floating-toolbar-confirmation-modal"
        options={confirmDialogOptions}
        onConfirm={(isChecked = false) => {
          if (!!confirmDialogOptions!.onConfirm) {
            dispatchCommand(confirmDialogOptions!.onConfirm(isChecked));
          } else {
            dispatchCommand(confirmButtonItem!.onClick);
          }
        }}
        onClose={() => {
          dispatchCommand(hideConfirmDialog());
          // Need to set focus to Editor here,
          // As when the Confirmation dialog pop up, and user interacts with the dialog, Editor loses focus.
          // So when Confirmation dialog is closed, Editor does not have the focus, then cursor goes to the position 1 of the doc,
          // instead of the cursor position before the dialog pop up.
          if (!editorView.hasFocus()) {
            editorView.focus();
          }
        }}
      />
    </ErrorBoundary>
  );
}

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
  getIntl: () => IntlShape;
  dispatch: Dispatch<FloatingToolbarPluginState>;
  providerFactory: ProviderFactory;
}) {
  const { floatingToolbarHandlers, providerFactory, getIntl } = options;
  const intl = getIntl();
  const getConfigWithNodeInfo = (editorState: EditorState) => {
    const activeConfigs = floatingToolbarHandlers
      .map((handler) => handler(editorState, intl, providerFactory))
      .filter(filterUndefined)
      .map((config) => sanitizeFloatingToolbarConfig(config));

    const relevantConfig =
      activeConfigs && getRelevantConfig(editorState.selection, activeConfigs);
    return relevantConfig;
  };

  const apply = (
    tr: ReadonlyTransaction,
    pluginState: FloatingToolbarPluginState,
  ) => {
    const newPluginState: FloatingToolbarPluginState = {
      getConfigWithNodeInfo,
    };
    return newPluginState;
  };

  return new SafePlugin({
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

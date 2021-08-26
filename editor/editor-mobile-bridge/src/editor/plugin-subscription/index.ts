import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';
import {
  EventDispatcher,
  textFormattingStateKey,
  TextFormattingState,
  blockPluginStateKey,
  BlockTypeState,
  listStateKey,
  ListState,
  textColorPluginKey,
  TextColorPluginState,
  hyperlinkStateKey,
  HyperlinkState,
  HyperlinkInsertStatus,
  historyPluginKey,
  HistoryPluginState,
  SelectionDataState,
  selectionPluginKey,
} from '@atlaskit/editor-core';

import { valueOf as valueOfListState } from '../web-to-native/listState';
import { valueOf as valueOfMarkState } from '../web-to-native/markState';
import WebBridgeImpl from '../native-to-web';
import { toNativeBridge } from '../web-to-native';
import { hasValue } from '../../utils';
import { createPromise } from '../../cross-platform-promise';
import EditorConfiguration from '../editor-configuration';
import { getSelectionObserverEnabled } from '../../query-param-reader';

interface BridgePluginListener<T> {
  bridge: string;
  pluginKey: PluginKey;
  updateAfterDom?: boolean;
  updater: (
    pluginState: T,
    view?: EditorView,
    initialPass?: boolean,
    bridge?: WebBridgeImpl,
  ) => void;
  sendInitialState?: boolean;
}

interface SerialisedTextColor {
  color: string | null;
  disabled?: boolean | undefined;
  borderColorPalette?: {
    [color: string]: string; // Hex
  };
  palette?: {
    [color: string]: string; // Hex
  };
}

const createListenerConfig = <T>(config: BridgePluginListener<T>) => config;

export const configFactory = (
  editorConfiguration: EditorConfiguration,
): Array<BridgePluginListener<any>> => {
  const configs: Array<BridgePluginListener<any>> = [
    createListenerConfig<TextFormattingState>({
      bridge: 'textFormatBridge',
      pluginKey: textFormattingStateKey,
      updater: (pluginState) => {
        toNativeBridge.call('textFormatBridge', 'updateTextFormat', {
          states: JSON.stringify(valueOfMarkState(pluginState)),
        });
      },
    }),
    createListenerConfig<BlockTypeState>({
      bridge: 'blockFormatBridge',
      pluginKey: blockPluginStateKey,
      updater: (pluginState) => {
        /**
         * Currently `updateBlockState` is on different bridges in native land.
         * We have a ticket to align on the naming.
         * @see https://product-fabric.atlassian.net/browse/FM-1341
         */
        if (window.webkit) {
          // iOS
          toNativeBridge.call('blockFormatBridge', 'updateBlockState', {
            states: pluginState.currentBlockType.name,
          });
        } else {
          // Android
          toNativeBridge.call('textFormatBridge', 'updateBlockState', {
            states: pluginState.currentBlockType.name,
          });
        }
      },
    }),
    createListenerConfig<TextColorPluginState>({
      bridge: 'textFormatBridge',
      pluginKey: textColorPluginKey,
      updater: (pluginState, _view, initialPass) => {
        let color = pluginState.color || null;
        let serialisedState: SerialisedTextColor = {
          color,
          disabled: pluginState.disabled,
        };

        if (initialPass) {
          let palette = Object.create(null);
          let borderColorPalette = Object.create(null);

          for (let { value, label, border } of pluginState.palette) {
            borderColorPalette[label.toLowerCase().replace(' ', '-')] = border;
            palette[label] = value;
          }

          serialisedState = {
            ...pluginState,
            color,
            borderColorPalette,
            palette,
          };
        }

        toNativeBridge.call('textFormatBridge', 'updateTextColor', {
          states: JSON.stringify(serialisedState),
        });
      },
      sendInitialState: true,
    }),
    createListenerConfig<HyperlinkState>({
      bridge: 'linkBridge',
      pluginKey: hyperlinkStateKey,
      updater: (pluginState, view) => {
        const { activeText, activeLinkMark, canInsertLink } = pluginState;
        const message = {
          text: '',
          url: '',
          top: -1,
          right: -1,
          bottom: -1,
          left: -1,
        };

        if (view && activeLinkMark && !!(activeLinkMark as any).node) {
          const coords = view.coordsAtPos((activeLinkMark as any).pos);
          message.top = coords.top;
          message.right = coords.right;
          message.bottom = coords.bottom;
          message.left = coords.left;
        }

        if (
          activeLinkMark &&
          activeLinkMark.type === HyperlinkInsertStatus.EDIT_LINK_TOOLBAR
        ) {
          const linkType = activeLinkMark.node.type.schema.marks.link;
          const linkText = activeLinkMark.node.textContent;

          message.text = linkText || '';
          message.url =
            activeLinkMark.node.marks
              .filter((mark) => mark.type === linkType)
              .map((link) => link.attrs.href)
              .pop() || '';
        }

        if (
          canInsertLink &&
          message.text.length === 0 &&
          hasValue(activeText)
        ) {
          message.text = activeText!;
        }

        toNativeBridge.call('linkBridge', 'currentSelection', message);
      },
    }),
    createListenerConfig<HistoryPluginState>({
      bridge: 'undoRedoBridge',
      pluginKey: historyPluginKey,
      updater: (pluginState, view) => {
        toNativeBridge.call('undoRedoBridge', 'stateChanged', {
          canUndo: pluginState.canUndo,
          canRedo: pluginState.canRedo,
        });
      },
    }),
  ];

  if (getSelectionObserverEnabled()) {
    configs.push(
      createListenerConfig<SelectionDataState>({
        bridge: 'selectionBridge',
        pluginKey: selectionPluginKey,
        updater: (pluginState, view) => {
          createPromise('onSelection', pluginState).submit();
        },
      }),
    );
  }

  const listConfiguration = createListenerConfig<ListState>({
    bridge: 'listBridge',
    pluginKey: listStateKey,
    updater: (pluginState) => {
      toNativeBridge.call('listBridge', 'updateListState', {
        states: JSON.stringify(valueOfListState(pluginState)),
      });
    },
  });
  configs.push(listConfiguration);

  return configs;
};

function initPluginListenersFactory(configs: Array<BridgePluginListener<any>>) {
  return function initPluginListeners(
    eventDispatcher: EventDispatcher,
    bridge: WebBridgeImpl,
    view: EditorView,
  ) {
    configs.forEach((config) => {
      const { updater, pluginKey } = config;
      const pluginState = pluginKey.getState(view.state);

      (bridge as any)[`${config.bridge}State`] = {
        ...(bridge as any)[`${config.bridge}State`],
        ...pluginState,
      };

      (bridge as any)[`${config.bridge}Listener`] = (
        pluginState: any,
        initialPass: boolean,
      ) => {
        if (config.updateAfterDom) {
          rafSchedule(() => updater(pluginState, view, initialPass, bridge))();
        } else {
          updater(pluginState, view, initialPass, bridge);
        }
      };

      if (config.sendInitialState && pluginState) {
        (bridge as any)[`${config.bridge}Listener`](pluginState, true);
      }

      eventDispatcher.on(
        (pluginKey as any).key,
        (bridge as any)[`${config.bridge}Listener`],
      );
    });

    return () => {
      const destroyPluginListeners = destroyPluginListenersFactory(configs);
      destroyPluginListeners(eventDispatcher, bridge);
    };
  };
}

function destroyPluginListenersFactory(
  configs: Array<BridgePluginListener<any>>,
) {
  return function destroyPluginListeners(
    eventDispatcher: EventDispatcher | undefined,
    bridge: WebBridgeImpl,
  ) {
    if (!eventDispatcher) {
      return;
    }

    configs.forEach((config) => {
      (bridge as any)[`${config.bridge}State`] = undefined;
      eventDispatcher.off(
        (config.pluginKey as any).key,
        (bridge as any)[`${config.bridge}Listener`],
      );
      (bridge as any)[`${config.bridge}Listener`] = undefined;
    });
  };
}

const defaultConfigs = configFactory(new EditorConfiguration());

export const destroyPluginListeners = (
  configs?: Array<BridgePluginListener<any>>,
) => {
  return destroyPluginListenersFactory(configs || defaultConfigs);
};

export const initPluginListeners = (
  configs?: Array<BridgePluginListener<any>>,
) => {
  return initPluginListenersFactory(configs || defaultConfigs);
};

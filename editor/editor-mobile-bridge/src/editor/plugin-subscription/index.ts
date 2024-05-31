import type { PluginKey, EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import rafSchedule from 'raf-schd';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { HistoryPluginState } from '@atlaskit/editor-plugin-history';
import type { SelectionDataState } from '../editor-plugins/mobile-selection';
import type WebBridgeImpl from '../native-to-web';
import { toNativeBridge } from '../web-to-native';
import { createPromise } from '../../cross-platform-promise';
import { getSelectionObserverEnabled } from '../../query-param-reader';
import EditorConfiguration from '../editor-configuration';

// TODO: When we extract the history plugin we can remove this
// @ts-ignore
const historyPluginKey = {
	key: 'historyPlugin$',
	getState: (state: EditorState) => {
		return (state as any)['historyPlugin$'];
	},
} as PluginKey;

// TODO: When we extract the selection plugin we can remove this
// @ts-ignore
const selectionPluginKey = {
	key: 'mobile-selection$',
	getState: (state: EditorState) => {
		return (state as any)['mobile-selection$'];
	},
} as PluginKey;

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

const createListenerConfig = <T>(config: BridgePluginListener<T>) => config;

export const configFactory = (
	editorConfiguration: EditorConfiguration,
): Array<BridgePluginListener<any>> => {
	const configs: Array<BridgePluginListener<any>> = [
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

			(bridge as any)[`${config.bridge}Listener`] = (pluginState: any, initialPass: boolean) => {
				if (config.updateAfterDom) {
					rafSchedule(() => updater(pluginState, view, initialPass, bridge))();
				} else {
					updater(pluginState, view, initialPass, bridge);
				}
			};

			if (config.sendInitialState && pluginState) {
				(bridge as any)[`${config.bridge}Listener`](pluginState, true);
			}

			eventDispatcher.on((pluginKey as any).key, (bridge as any)[`${config.bridge}Listener`]);
		});

		return () => {
			const destroyPluginListeners = destroyPluginListenersFactory(configs);
			destroyPluginListeners(eventDispatcher, bridge);
		};
	};
}

function destroyPluginListenersFactory(configs: Array<BridgePluginListener<any>>) {
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

export const destroyPluginListeners = (configs?: Array<BridgePluginListener<any>>) => {
	return destroyPluginListenersFactory(configs || defaultConfigs);
};

export const initPluginListeners = (configs?: Array<BridgePluginListener<any>>) => {
	return initPluginListenersFactory(configs || defaultConfigs);
};

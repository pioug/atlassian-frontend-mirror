import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import type { ConnectivityPlugin, Mode, PluginState } from './connectivityPluginType';
import { createPlugin, key } from './pm-plugins/main';

const defaultState: PluginState = {
	mode: 'online',
};

export const connectivityPlugin: ConnectivityPlugin = () => ({
	name: 'connectivity',
	getSharedState(editorState) {
		if (!editorState) {
			return defaultState;
		}
		return key.getState(editorState) ?? defaultState;
	},
	pmPlugins: () => {
		return [
			{
				name: 'connectivity',
				plugin: createPlugin,
			},
		];
	},
	usePluginHook: ({ editorView }) => {
		useEffect(() => {
			const dispatch = (value: Mode) => {
				const {
					dispatch,
					state: { tr },
				} = editorView;
				dispatch(tr.setMeta(key, value));
			};

			const handleOnline = () => dispatch('online');
			const handleOffline = () => dispatch('offline');

			if (window.navigator.onLine === false) {
				dispatch('offline');
			}

			const cleanupOnlineListener = bind(window, {
				type: 'online',
				listener: handleOnline,
			});
			const cleanupOfflineListener = bind(window, {
				type: 'offline',
				listener: handleOffline,
			});
			return () => {
				cleanupOnlineListener();
				cleanupOfflineListener();
			};
		}, [editorView]);
	},
});

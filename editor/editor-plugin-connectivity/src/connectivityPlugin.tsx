import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import type { EditorCommand } from '@atlaskit/editor-common/types';

import type { ConnectivityPlugin, Mode } from './connectivityPluginType';
import { createPlugin, key } from './pm-plugins/main';

export const connectivityPlugin: ConnectivityPlugin = () => {
	let previousMode: Mode | undefined | null;
	return {
		name: 'connectivity',
		getSharedState(editorState) {
			if (!editorState) {
				return { mode: 'online' };
			}
			const pluginState = key.getState(editorState);
			return {
				mode: pluginState?.externalState ?? pluginState?.browserState ?? 'online',
			};
		},
		commands: {
			setMode:
				(mode: Mode | null): EditorCommand =>
				({ tr }) => {
					// Leave early if the mode has not changed
					if (mode === previousMode) {
						return null;
					}
					previousMode = mode;
					return tr.setMeta(key, { externalState: mode });
				},
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
					dispatch(tr.setMeta(key, { browserState: value }));
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
	};
};

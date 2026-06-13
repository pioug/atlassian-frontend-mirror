import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { CodeBlockPlugin } from '../index';
import { removeAutoDetection, updateAutoDetectState } from '../utils/auto-detect-state';
import { syncPendingDetectionTimers, type AutoDetectTimer } from '../utils/auto-detect-view';

import { ACTIONS } from './actions';
import { autoDetectPluginKey, type AutoDetectState } from './auto-detect-state';

export const createAutoDetectPlugin = (
	api?: ExtractInjectionAPI<CodeBlockPlugin>,
): SafePlugin<AutoDetectState> =>
	new SafePlugin({
		key: autoDetectPluginKey,
		state: {
			init(): AutoDetectState {
				return {
					languageDetectionMap: {},
				};
			},
			apply(tr, pluginState): AutoDetectState {
				const meta = tr.getMeta(autoDetectPluginKey);
				let languageDetectionMap = tr.docChanged
					? updateAutoDetectState(tr, pluginState)
					: pluginState.languageDetectionMap;

				if (meta?.type === ACTIONS.SET_AUTO_DETECT_ENTRY) {
					languageDetectionMap = {
						...languageDetectionMap,
						[meta.data.localId]: meta.data.entry,
					};
				} else if (meta?.type === ACTIONS.REMOVE_AUTO_DETECT_ENTRY) {
					languageDetectionMap = removeAutoDetection(languageDetectionMap, meta.data.localId);
				}

				if (languageDetectionMap === pluginState.languageDetectionMap) {
					return pluginState;
				}

				return {
					languageDetectionMap,
				};
			},
		},
		view(view) {
			const timers = new Map<string, AutoDetectTimer>();

			return {
				update() {
					syncPendingDetectionTimers(view, timers, api);
				},
				destroy() {
					timers.forEach(({ timer }) => clearTimeout(timer));
					timers.clear();
				},
			};
		},
	});

import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomPluginOptions } from '../types';
import { setupLoom } from './commands';

export interface LoomPluginState {
	error: SDKUnsupportedReasons | undefined;
	isEnabled: boolean;
	isRecordingVideo: boolean;
	loomButton: HTMLButtonElement | null;
	recordVideo?: (source: 'editor-pinned-toolbar') => void;
}

export enum LoomPluginAction {
	ENABLE,
	DISABLE,
	RECORD_VIDEO,
	INSERT_VIDEO,
}

export const loomPluginKey: PluginKey<LoomPluginState> = new PluginKey<LoomPluginState>('loom');

export const createPlugin = ({
	config,
	api,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	config: LoomPluginOptions;
}): SafePlugin<LoomPluginState> => {
	return new SafePlugin({
		key: loomPluginKey,
		state: {
			init: (): LoomPluginState => ({
				isEnabled: false,
				loomButton: null,
				isRecordingVideo: false,
				error: undefined,
			}),
			apply: (tr: ReadonlyTransaction, pluginState: LoomPluginState): LoomPluginState => {
				const action = tr.getMeta(loomPluginKey)?.type;
				switch (action) {
					case LoomPluginAction.ENABLE:
						const { loomButton, recordVideo } = tr.getMeta(loomPluginKey);
						return {
							...pluginState,
							isEnabled: true,
							loomButton,
							recordVideo,
						};
					case LoomPluginAction.DISABLE:
						const { error } = tr.getMeta(loomPluginKey);
						return {
							...pluginState,
							isEnabled: false,
							loomButton: null,
							error,
						};
					case LoomPluginAction.RECORD_VIDEO:
						// Click the unmounted button in state that has the Loom SDK attached
						const { source } = tr.getMeta(loomPluginKey);
						if (
							source === 'editor-pinned-toolbar' &&
							pluginState.recordVideo &&
							isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')
						) {
							pluginState.recordVideo(source);
						} else {
							pluginState?.loomButton?.click();
						}

						return {
							...pluginState,
							isRecordingVideo: true,
						};
					case LoomPluginAction.INSERT_VIDEO:
						return {
							...pluginState,
							isRecordingVideo: false,
						};
					default:
						return pluginState;
				}
			},
		},
		view(editorView: EditorView) {
			if (config.loomProvider) {
				setupLoom(config.loomProvider, api, editorView);
			}

			return {};
		},
	});
};

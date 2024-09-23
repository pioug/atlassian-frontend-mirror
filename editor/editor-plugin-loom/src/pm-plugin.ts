import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setupLoom } from './commands';
import type { LoomPlugin } from './plugin';
import type { LoomPluginOptions } from './types';

export interface LoomPluginState {
	isEnabled: boolean;
	loomButton: HTMLButtonElement | null;
	isRecordingVideo: boolean;
	error: SDKUnsupportedReasons | undefined;
}

export enum LoomPluginAction {
	ENABLE,
	DISABLE,
	RECORD_VIDEO,
	INSERT_VIDEO,
}

export const loomPluginKey = new PluginKey<LoomPluginState>('loom');

export const createPlugin = ({
	config,
	api,
}: {
	config: LoomPluginOptions;
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
}) => {
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
						const { loomButton } = tr.getMeta(loomPluginKey);
						return {
							...pluginState,
							isEnabled: true,
							loomButton,
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
						pluginState?.loomButton?.click();

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

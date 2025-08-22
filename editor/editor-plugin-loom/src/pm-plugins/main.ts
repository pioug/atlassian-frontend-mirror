// TODO: ED-26959 - removed to support TypeScript bundler mode
// import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomPluginOptions } from '../types';

// copied from @loomhq/record-sdk
// TODO: ED-26959 - remove once @loomhq/record-sdk get updated to support "package exports"
enum SDKUnsupportedReasons {
	IncompatibleBrowser = 'incompatible-browser',
	ThirdPartyCookiesDisabled = 'third-party-cookies-disabled',
	NoMediaStreamsSupport = 'no-media-streams-support',
}

import { setupLoom } from './commands';

export interface LoomPluginState {
	error: SDKUnsupportedReasons | undefined;
	isEnabled: boolean;
	isRecordingVideo: boolean;
	loomButton: HTMLButtonElement | null;
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
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	config: LoomPluginOptions;
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

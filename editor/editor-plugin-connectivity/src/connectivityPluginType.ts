import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export type ConnectivityPlugin = NextEditorPlugin<
	'connectivity',
	{
		commands: {
			/**
			 *
			 * SetMode overrides the network mode. Example: Can be used by the editor to set if your connectivity is based on
			 * websockets being connected. To unset and rely on the default mode again can pass `null`.
			 *
			 * By default the mode is controlled by:
			 * https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event
			 *
			 * @example
			 * ```ts
			 * editorApi?.core?.actions.execute(
			 *   editorApi?.connectivity?.commands.setMode('offline')
			 * );
			 * ```
			 *
			 * @param mode \"online\" | \"offline\" | \"collab-offline\" | \"internet-offline\" | null
			 * @returns EditorCommand
			 */
			setMode: (mode: Mode | null) => EditorCommand;
		};
		sharedState: PublicPluginState;
	}
>;

export type PluginState = {
	browserState: Mode;
	externalState: Mode | undefined;
};

export type PublicPluginState = {
	mode: Mode;
};

export type Mode = 'offline' | 'online' | 'collab-offline' | 'internet-offline';

/**
 * Check if the connectivity mode represents ANY offline state
 */
export const isOfflineMode = (mode: Mode | undefined): boolean => {
	if (editorExperiment('platform_synced_blocks_offline_check_for_block', true)) {
		return mode === 'offline' || mode === 'collab-offline' || mode === 'internet-offline';
	}

	// Original behaviour: only "offline" is offline
	return mode === 'offline';
};

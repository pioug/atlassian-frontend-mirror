import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type ConnectivityPlugin = NextEditorPlugin<
	'connectivity',
	{
		sharedState: PublicPluginState;
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
			 * @param mode "online" | "offline" | null
			 * @returns EditorCommand
			 */
			setMode: (mode: Mode | null) => EditorCommand;
		};
	}
>;

export type PluginState = {
	browserState: Mode;
	externalState: Mode | undefined;
};

export type PublicPluginState = {
	mode: Mode;
};

export type Mode = 'offline' | 'online';

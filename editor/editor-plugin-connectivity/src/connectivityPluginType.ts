import type { Mode } from '@atlaskit/editor-common/connectivity/mode';
import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

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

/**
 * Use `Mode` from `@atlaskit/editor-common/connectivity/mode` instead.
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-62479 Internal documentation for deprecation (no external access)}
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export
export type { Mode } from '@atlaskit/editor-common/connectivity/mode';

/**
 * Use `isOfflineMode` from `@atlaskit/editor-common/connectivity/isOfflineMode` instead.
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-62479 Internal documentation for deprecation (no external access)}
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';

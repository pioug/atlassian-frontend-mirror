import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

/**
 * **Warning: This hook is controlled by the `platform_editor_usesharedpluginstateselector` experiment.**
 *
 * This hook is a migrator for the legacy `useSharedPluginState` hook and will be removed in the future.
 * Please use `useSharedPluginStateSelector` instead.
 *
 * @param newHook A new hook that builds the state from `useSharedPluginStateSelector`
 * @param oldHook The legacy useSharedPluginState hook
 * @returns
 */
export function sharedPluginStateHookMigratorFactory<Result, A>(
	newHook: (...args: A[]) => Result,
	oldHook: (...args: A[]) => Result,
): (...args: A[]) => Result {
	return conditionalHooksFactory(
		() => editorExperiment('platform_editor_usesharedpluginstateselector', true),
		newHook,
		oldHook,
	);
}

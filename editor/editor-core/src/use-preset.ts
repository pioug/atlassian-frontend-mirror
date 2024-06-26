import type { DependencyList } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';

import {
	type AllEditorPresetPluginTypes,
	EditorPresetBuilder,
	type ExtractPresetAPI,
} from '@atlaskit/editor-common/preset';

interface PresetAPI<Preset extends EditorPresetBuilder<any, any>> {
	// Due to TypeScript limitation (see: https://github.com/microsoft/TypeScript/issues/34933)
	// we may be need to return any
	editorApi:
		| (Preset extends EditorPresetBuilder<any, any> ? ExtractPresetAPI<Preset> : never)
		| undefined;
	preset: Preset;
}

/**
 * Creates a preset.
 *
 * Takes an input function that returns a preset (and memoizes it) depending
 * on the dependency array provided.
 *
 * Returns a pluginInjectionApi in order to apply actions and subscribe to plugin
 * changes outside of the editor.
 *
 * @param createPreset
 * @param dependencies
 * @returns PresetAPI ({ pluginInjectionApi, preset, actionBuilder })
 *
 * Example:
 * ```ts
 * function ExampleEditor() {
 *   const { preset, editorApi } = usePreset((builder) =>
 *     builder.add(plugin1).add(plugin2)
 *   , []);
 *
 *   // Can execute typesafe commands based on plugin1 or 2
 *   const runCommand = () => editorApi.core.actions.execute(
 *     editorApi.plugin1.commands.doSomething()
 *   )
 *   return (
 *     <>
 *       <Editor preset={preset} />
 *       <Button onClick={runCommand}>Run command</Button>
 *     </>
 *   )
 * }
 * ```
 */
export function usePreset<
	PluginNames extends string[],
	StackPlugins extends AllEditorPresetPluginTypes[],
	Preset extends EditorPresetBuilder<PluginNames, StackPlugins>,
>(
	createPreset: (builder: EditorPresetBuilder) => Preset,
	dependencies: DependencyList = [],
): PresetAPI<Preset> {
	const [editorApi, setAPI] = useState<PresetAPI<Preset>['editorApi'] | undefined>(undefined);
	const preset = useMemo(
		() => createPreset(new EditorPresetBuilder()),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies,
	);
	useLayoutEffect(() => {
		preset.apiPromise.then((api) => {
			setAPI(api as unknown as PresetAPI<Preset>['editorApi']);
		});
	}, [preset.apiPromise]);

	return {
		editorApi,
		preset,
	};
}

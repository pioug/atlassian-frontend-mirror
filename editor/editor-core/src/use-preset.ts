import type { DependencyList } from 'react';
import { useMemo } from 'react';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
  AllEditorPresetPluginTypes,
  ExtractPublicEditorAPI,
  ExtractNextEditorPlugins,
} from '@atlaskit/editor-common/types';
import { usePresetContext } from './presets/context';

interface PresetAPI<
  PluginNames extends string[] = [],
  StackPlugins extends AllEditorPresetPluginTypes[] = [],
> {
  editorApi:
    | ExtractPublicEditorAPI<EditorPresetBuilder<PluginNames, StackPlugins>>
    | undefined;
  preset: EditorPresetBuilder<PluginNames, StackPlugins>;
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
 *   const { preset, editorApi } = usePreset(() =>
 *     new EditorPresetBuilder().add(plugin1).add(plugin2)
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
  PluginNames extends string[] = [],
  StackPlugins extends AllEditorPresetPluginTypes[] = [],
>(
  createPreset: () => EditorPresetBuilder<PluginNames, StackPlugins>,
  dependencies: DependencyList,
): PresetAPI<PluginNames, StackPlugins> {
  const editorApi = usePresetContext<ExtractNextEditorPlugins<StackPlugins>>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const preset = useMemo(createPreset, dependencies);

  return {
    editorApi,
    preset,
  };
}

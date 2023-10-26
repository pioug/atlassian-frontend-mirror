import createUniversalPreset from '../presets/universal';
import type { EditorProps, EditorPlugin } from '../types';
import { getDefaultPresetOptionsFromEditorProps } from './create-plugins-list';
import { createFeatureFlagsFromProps } from './feature-flags-from-props';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

// Separate file, we should not accidentally import this into the `ComposableEditor`
// otherwise it will blow up the bundle size.
export function createPreset(props: EditorProps, prevProps?: EditorProps) {
  const preset = createUniversalPreset(
    props.appearance,
    getDefaultPresetOptionsFromEditorProps(props),
    createFeatureFlagsFromProps(props),
    prevProps?.appearance,
  );

  return withDangerouslyAppendPlugins(preset)(
    props.dangerouslyAppendPlugins?.__plugins,
  );
}

function withDangerouslyAppendPlugins(preset: EditorPresetBuilder<any, any>) {
  function createEditorNextPluginsFromDangerouslyAppended(
    plugins: EditorPlugin[],
  ): NextEditorPlugin<any, any>[] {
    return plugins ? plugins.map((plugin) => () => plugin) : [];
  }

  return (editorPluginsToAppend?: EditorPlugin[]) => {
    if (!editorPluginsToAppend || editorPluginsToAppend.length === 0) {
      return preset;
    }

    const nextEditorPluginsToAppend =
      createEditorNextPluginsFromDangerouslyAppended(editorPluginsToAppend);

    const presetWithAppendedPlugins = nextEditorPluginsToAppend.reduce(
      (acc, plugin) => {
        return acc.add(plugin);
      },
      preset,
    );

    return presetWithAppendedPlugins;
  };
}

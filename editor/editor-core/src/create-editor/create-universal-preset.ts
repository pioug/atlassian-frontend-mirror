import type { EditorPlugin, NextEditorPlugin } from '@atlaskit/editor-common/types';

import createUniversalPresetInternal, {
	type InitialPluginConfiguration,
} from '../presets/universal';
import type { EditorProps } from '../types';

import { getDefaultPresetOptionsFromEditorProps } from './create-plugins-list';
import { createFeatureFlagsFromProps } from './feature-flags-from-props';

// Separate file, we should not accidentally import this into the `ComposableEditor`
// otherwise it will blow up the bundle size.
export function createUniversalPreset({
	props,
	prevProps,
	initialPluginConfiguration,
}: {
	props: EditorProps;
	prevProps?: EditorProps;
	initialPluginConfiguration?: InitialPluginConfiguration;
}) {
	const preset = createUniversalPresetInternal({
		appearance: props.appearance,
		props: getDefaultPresetOptionsFromEditorProps(props),
		initialPluginConfiguration: initialPluginConfiguration,
		featureFlags: createFeatureFlagsFromProps(props.featureFlags),
		prevAppearance: prevProps?.appearance,
	});

	return withDangerouslyAppendPlugins(preset)(props.dangerouslyAppendPlugins?.__plugins);
}

function withDangerouslyAppendPlugins(
	preset: ReturnType<typeof createUniversalPresetInternal>,
): (plugins: EditorPlugin[] | undefined) => ReturnType<typeof createUniversalPresetInternal> {
	function createEditorNextPluginsFromDangerouslyAppended(
		plugins: EditorPlugin[],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): NextEditorPlugin<any, any>[] {
		return plugins ? plugins.map((plugin) => () => plugin) : [];
	}

	return (editorPluginsToAppend?: EditorPlugin[]) => {
		if (!editorPluginsToAppend || editorPluginsToAppend.length === 0) {
			return preset;
		}

		const nextEditorPluginsToAppend =
			createEditorNextPluginsFromDangerouslyAppended(editorPluginsToAppend);

		const presetWithAppendedPlugins = nextEditorPluginsToAppend.reduce((acc, plugin) => {
			// These are dangerously appended, we don't need their type information leaking into
			// universal preset
			// @ts-expect-error
			return acc.add(plugin) as unknown as ReturnType<typeof createUniversalPresetInternal>;
		}, preset);

		return presetWithAppendedPlugins;
	};
}

import createUniversalPresetInternal from '../presets/universal';
import type { InitialPluginConfiguration } from '../presets/universal';
import type { EditorProps } from '../types/editor-props';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';

import { getDefaultPresetOptionsFromEditorProps } from './create-plugins-list';

// Separate file, we should not accidentally import this into the `ComposableEditor`
// otherwise it will blow up the bundle size.
export function createUniversalPreset({
	props,
	prevProps,
	initialPluginConfiguration,
}: {
	initialPluginConfiguration?: InitialPluginConfiguration;
	prevProps?: EditorProps;
	props: EditorProps;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for --isolatedDeclarations; preset builder return type is too complex to spell out here.
}): any {
	return createUniversalPresetInternal({
		appearance: props.appearance,
		props: getDefaultPresetOptionsFromEditorProps(props),
		initialPluginConfiguration: initialPluginConfiguration,
		featureFlags: createFeatureFlagsFromProps(props.featureFlags),
		prevAppearance: prevProps?.appearance,
	});
}

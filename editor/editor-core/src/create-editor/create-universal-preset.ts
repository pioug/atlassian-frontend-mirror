import createUniversalPresetInternal, {
	type InitialPluginConfiguration,
} from '../presets/universal';
import type { EditorProps } from '../types';
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
}) {
	return createUniversalPresetInternal({
		appearance: props.appearance,
		props: getDefaultPresetOptionsFromEditorProps(props),
		initialPluginConfiguration: initialPluginConfiguration,
		featureFlags: createFeatureFlagsFromProps(props.featureFlags),
		prevAppearance: prevProps?.appearance,
	});
}

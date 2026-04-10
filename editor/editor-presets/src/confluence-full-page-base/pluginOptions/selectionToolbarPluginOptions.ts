import type { UserPreferencesProvider } from '@atlaskit/editor-common/types';
import type { SelectionToolbarPluginOptions } from '@atlaskit/editor-plugin-selection-toolbar';

interface Props {
	options: {
		contextualFormattingEnabled: boolean;
		disablePin?: boolean;
	};
	providers: {
		userPreferencesProvider: UserPreferencesProvider | undefined;
	};
}

export function selectionToolbarPluginOptions({
	options,
	providers,
}: Props): SelectionToolbarPluginOptions {
	return {
		preferenceToolbarAboveSelection: false,
		contextualFormattingEnabled: options.contextualFormattingEnabled,
		userPreferencesProvider: providers.userPreferencesProvider,
		disablePin: options.disablePin,
	};
}

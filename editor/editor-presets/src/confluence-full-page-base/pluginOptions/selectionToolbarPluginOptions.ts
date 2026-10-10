import type { UserPreferencesProvider } from '@atlaskit/editor-common/types/user-preferences';
import type { SelectionToolbarPluginOptions } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';

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

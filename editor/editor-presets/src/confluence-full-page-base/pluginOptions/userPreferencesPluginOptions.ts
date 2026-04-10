import type { UserPreferencesProvider } from '@atlaskit/editor-common/user-preferences';
import type { UserPreferencesPluginOptions } from '@atlaskit/editor-plugin-user-preferences';

interface Props {
	options: {
		initialToolbarDockingPosition?: 'none' | 'top';
	};
	providers: {
		userPreferencesProviderNext?: UserPreferencesProvider;
	};
}

export function userPreferencesPluginOptions({
	providers,
	options,
}: Props): UserPreferencesPluginOptions {
	return {
		userPreferencesProvider: providers.userPreferencesProviderNext,
		// If initialToolbarDockingPosition is set, use it to override any saved user preference
		initialUserPreferences: options.initialToolbarDockingPosition
			? { toolbarDockingPosition: options.initialToolbarDockingPosition }
			: undefined,
	};
}

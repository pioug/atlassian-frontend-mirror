import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { logException } from '@atlaskit/editor-common/monitoring';
import { type UserPreferencesProvider } from '@atlaskit/editor-common/user-preferences';

export const useDocumentVisibilityWatcher = (userPreferencesProvider?: UserPreferencesProvider): void => {
	useEffect(() => {
		if (userPreferencesProvider) {
			const refreshPreferences = async () => {
				if (document.visibilityState === 'visible') {
					try {
						await userPreferencesProvider.loadPreferences();
					} catch (error) {
						logException(error as Error, {
							location: 'editor-plugin-user-preferences/userPreferencesPlugin',
						});
					}
				}
			};

			return bind(document, {
				type: 'visibilitychange',
				listener: refreshPreferences,
			});
		}
	}, [userPreferencesProvider]);
};

import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { logException } from '@atlaskit/editor-common/monitoring';
import { ExtractInjectionAPI, UserPreferencesProvider } from '@atlaskit/editor-common/types';

import { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

export const PageVisibilityWatcher = ({
	api,
	userPreferencesProvider,
}: {
	api: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined;
	userPreferencesProvider?: UserPreferencesProvider;
}) => {
	useEffect(() => {
		if (!userPreferencesProvider || !api) {
			return;
		}

		return bind(document, {
			type: 'visibilitychange',
			listener: async () => {
				if (document.visibilityState === 'visible') {
					try {
						await userPreferencesProvider.loadPreferences();
					} catch (error) {
						logException(error as Error, {
							location: 'editor-plugin-selection-toolbar/PageVisibilityWatcher',
						});
					}

					api?.selectionToolbar?.actions?.refreshToolbarDocking?.();
				}
			},
		});
	}, [api, userPreferencesProvider]);

	return null;
};

import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI, UserPreferencesProvider } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

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

		if (!fg('platform_editor_controls_patch_6')) {
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
		}

		const refreshPrefrerence = async () => {
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
		};

		refreshPrefrerence();

		return bind(document, {
			type: 'visibilitychange',
			listener: refreshPrefrerence,
		});
	}, [api, userPreferencesProvider]);

	return null;
};

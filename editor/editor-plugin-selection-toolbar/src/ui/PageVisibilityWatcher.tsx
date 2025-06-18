import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI, UserPreferencesProvider } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

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

		if (editorExperiment('platform_editor_controls_performance_fixes', false)) {
			refreshPrefrerence();
		}

		return bind(document, {
			type: 'visibilitychange',
			listener: refreshPrefrerence,
		});
	}, [api, userPreferencesProvider]);

	return null;
};

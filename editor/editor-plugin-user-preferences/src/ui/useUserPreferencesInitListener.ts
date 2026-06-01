import { useEffect, useRef } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { UserPreferencesPlugin } from '../userPreferencesPluginType';

export const useUserPreferencesInitListener = (
	isInitialized: boolean,
	resolvedUserPreferences: ResolvedUserPreferences | null,
	api?: ExtractInjectionAPI<UserPreferencesPlugin>,
): void => {
	const isInitializedRef = useRef(false);

	useEffect(() => {
		if (isInitialized && resolvedUserPreferences && !isInitializedRef.current) {
			isInitializedRef.current = true;
			api?.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.INITIALISED,
				actionSubject: ACTION_SUBJECT.USER_PREFERENCES,
				actionSubjectId: ACTION_SUBJECT_ID.SELECTION_TOOLBAR_PREFERENCES,
				attributes: { toolbarDocking: resolvedUserPreferences.toolbarDockingPosition },
				eventType: EVENT_TYPE.OPERATIONAL,
			});

			// Only users with the toolbar docked at the top will see the button, so we
			// constrain the experiment population here rather than on every editor load.
			// This call is purely to log the exposure.
			if (resolvedUserPreferences.toolbarDockingPosition === 'top') {
				// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				expValEquals('platform_editor_ai_improve_formatting_toolbar', 'isEnabled', true);
			}
		}
	}, [api, isInitialized, resolvedUserPreferences]);
};

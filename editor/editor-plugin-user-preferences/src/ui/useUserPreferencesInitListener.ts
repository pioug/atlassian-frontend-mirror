import { useEffect, useRef } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';

import type { UserPreferencesPlugin } from '../userPreferencesPluginType';

export const useUserPreferencesInitListener = (
	isInitialized: boolean,
	resolvedUserPreferences: ResolvedUserPreferences | null,
	api?: ExtractInjectionAPI<UserPreferencesPlugin>,
) => {
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
		}
	}, [api, isInitialized, resolvedUserPreferences]);
};

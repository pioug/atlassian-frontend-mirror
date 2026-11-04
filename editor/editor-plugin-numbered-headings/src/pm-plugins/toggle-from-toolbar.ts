// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { collectHeadings } from './main';

export const toggleFromToolbar = (
	api: ExtractInjectionAPI<InternalNumberedHeadingsPlugin> | undefined,
	enabled: boolean,
): boolean => {
	const state = api?.numberedHeadings?.sharedState.currentState();
	if (!api || !state || state.enabled === enabled) {
		return false;
	}

	// The external state plugin saves the change, and its undo and redo.
	return api.core.actions.execute(({ tr }) => {
		const result = api.externalState.commands.setState('numberedHeadings', { enabled })({ tr });
		if (!result) {
			return null;
		}

		api.analytics?.actions.attachAnalyticsEvent({
			action: ACTION.TOGGLED,
			actionSubject: ACTION_SUBJECT.NUMBERED_HEADINGS,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				enabled,
				headingCount: collectHeadings(result.doc).length,
				inputMethod: INPUT_METHOD.TOOLBAR,
			},
		})(result);

		return result;
	});
};

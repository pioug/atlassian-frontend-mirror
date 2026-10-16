import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { collectHeadings, numberedHeadingsPluginKey } from './main';

/** Internal toolbar toggle, excluded from undo history and reported as a user action. */
export const toggleFromToolbar =
	(
		api: ExtractInjectionAPI<InternalNumberedHeadingsPlugin> | undefined,
		enabled: boolean,
	): EditorCommand =>
	({ tr }) => {
		const state = api?.numberedHeadings?.sharedState.currentState();
		if (
			!state ||
			!isExperimentEnabled('platform_editor_numbered_headings') ||
			state.enabled === enabled
		) {
			return null;
		}

		const result = tr.setMeta(numberedHeadingsPluginKey, enabled).setMeta('addToHistory', false);

		api?.analytics?.actions.attachAnalyticsEvent({
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
	};

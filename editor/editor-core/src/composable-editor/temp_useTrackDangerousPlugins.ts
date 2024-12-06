import { useEffect } from 'react';

import { ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EditorProps } from '../types/editor-props';

// Temporary - track the usage of `dangerouslyAppendPlugins` which is deprecated
// Once `platform_editor_jira_base_composable` and `platform_editor_jira_polaris_composable` have
// fully rolled out in Jira this should trend to 0 and we can delete the deprecated prop.
export const useTrackDangerouslyAppendPlugins = (
	passedProps: EditorProps,
	handleAnalyticsEvent: FireAnalyticsCallback,
) => {
	useEffect(() => {
		if (
			(passedProps?.dangerouslyAppendPlugins?.__plugins ?? []).length > 0 &&
			fg('platform_editor_track_dangerous_append_plugins')
		) {
			handleAnalyticsEvent({
				payload: {
					// @ts-expect-error Temporary action - let's not extend the public analytics enum
					action: 'dangerousPluginAppended',
					actionSubject: ACTION_SUBJECT.EDITOR,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						count: passedProps?.dangerouslyAppendPlugins?.__plugins.length,
						names: passedProps?.dangerouslyAppendPlugins?.__plugins.map((plugin) => plugin.name),
					},
				},
			});
		}
	}, [handleAnalyticsEvent, passedProps?.dangerouslyAppendPlugins?.__plugins]);
};

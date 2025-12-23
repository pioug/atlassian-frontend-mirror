import { useEffect } from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import type { EditorAppearance } from '@atlaskit/editor-common/types';

import { formatFullWidthAppearance } from './formatFullWidthAppearance';

export const useFireFullWidthEvent = (
	appearance: EditorAppearance | undefined,
	dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void,
): void => {
	const previousAppearance = usePreviousState(appearance);

	useEffect(() => {
		if (appearance !== previousAppearance) {
			if (appearance === 'full-width' || previousAppearance === 'full-width') {
				dispatchAnalyticsEvent({
					action: ACTION.CHANGED_FULL_WIDTH_MODE,
					actionSubject: ACTION_SUBJECT.EDITOR,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						previousMode: formatFullWidthAppearance(previousAppearance),
						newMode: formatFullWidthAppearance(appearance),
					},
				});
			}
		}
	}, [appearance, previousAppearance, dispatchAnalyticsEvent]);
};

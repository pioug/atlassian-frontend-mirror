import { useCallback } from 'react';

import uuid from 'uuid';

import { useAnalyticsEvents } from '../../../common/analytics/generated/use-analytics-events';
import * as measure from '../../../utils/performance';
import { failUfoExperience, startUfoExperience, succeedUfoExperience } from '../../analytics';

import { type InvokeClientActionHandler, type UseInvokeClientActionProps } from './types';

const ACTION_EXPERIENCE_NAME = 'smart-link-action-invocation';

/**
 * Invoke client action such as preview, download and open link
 */
const useInvokeClientAction = ({
	fireEvent: fireEventProp,
}: UseInvokeClientActionProps): InvokeClientActionHandler => {
	const { fireEvent: defaultFireEvent } = useAnalyticsEvents();
	const fireEvent = fireEventProp ?? defaultFireEvent;

	return useCallback(
		async ({
			actionSubjectId,
			actionType,
			actionFn,
			definitionId = null,
			extensionKey,
			display,
			id,
			resourceType = null,
		}) => {
			const experienceId = uuid();

			// Begin performance instrumentation.
			const markName = `${experienceId}-${actionType}`;
			measure.mark(markName, 'pending');

			try {
				// Begin UFO experience
				startUfoExperience(ACTION_EXPERIENCE_NAME, experienceId, {
					actionType,
					display,
					extensionKey,
					invokeType: 'client',
				});

				// Begin analytics instrumentation.
				if (actionSubjectId !== undefined) {
					fireEvent(`ui.button.clicked.${actionSubjectId}`, {
						actionType: actionType ?? null,
						definitionId,
						display: display ?? null,
						id: id ?? experienceId,
						resourceType,
					});
				}
				// Invoke action
				const result = await actionFn();

				measure.mark(markName, 'resolved');
				succeedUfoExperience(ACTION_EXPERIENCE_NAME, experienceId);
				fireEvent('operational.smartLinkAction.resolved', {
					actionType: actionType ?? null,
					definitionId,
					display: display ?? null,
					duration: measure.getMeasure(markName, 'resolved')?.duration ?? null,
					id: id ?? experienceId,
					resourceType,
				});

				return result;
			} catch (err) {
				measure.mark(markName, 'errored');
				failUfoExperience(ACTION_EXPERIENCE_NAME, experienceId);
				const reason = typeof err === 'string' ? err : (err as any)?.message;

				fireEvent('operational.smartLinkAction.unresolved', {
					actionType: actionType ?? null,
					definitionId,
					display: display ?? null,
					duration: measure.getMeasure(markName, 'errored')?.duration ?? null,
					id: id ?? experienceId,
					reason,
					resourceType,
				});
			}
		},
		[fireEvent],
	);
};

export default useInvokeClientAction;

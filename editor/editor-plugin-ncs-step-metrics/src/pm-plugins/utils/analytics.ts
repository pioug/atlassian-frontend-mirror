import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	NcsSessionStepEventAEP,
	NcsSessionStepMetrics,
} from '@atlaskit/editor-common/analytics';

/**
 * Transforms the session step metrics into a payload for analytics.
 * @param sessionStepMetrics - The session step metrics to be sent as an analytics event.
 */
export const getPayload = (sessionStepMetrics: NcsSessionStepMetrics): NcsSessionStepEventAEP => {
	return {
		action: ACTION.NCS_SESSION_STEP_METRICS,
		actionSubject: ACTION_SUBJECT.COLLAB,
		attributes: sessionStepMetrics,
		eventType: EVENT_TYPE.OPERATIONAL,
	};
};

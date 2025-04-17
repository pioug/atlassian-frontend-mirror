import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { type ErrorAttributes } from '../client/types';
import { type ProfileType } from '../types';

import { getPageTime } from './performance';

/** Below lines are copied from teams common analytics */
const ANALYTICS_CHANNEL = 'peopleTeams';

const runItLater = (cb: (arg: any) => void) => {
	const requestIdleCallback = (window as any).requestIdleCallback;
	if (typeof requestIdleCallback === 'function') {
		return requestIdleCallback(cb);
	}

	if (typeof window.requestAnimationFrame === 'function') {
		return window.requestAnimationFrame(cb);
	}

	return () => setTimeout(cb);
};

type GenericAttributes =
	| Record<string, string | number | boolean | undefined | string[]>
	| ErrorAttributes;

interface AnalyticsEvent {
	action?: string;
	actionSubject?: string;
	actionSubjectId?: string;
	attributes?: GenericAttributes;
	name?: string;
	source?: string;
}

export const fireEvent = (
	createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
	body: AnalyticsEvent,
) => {
	if (!createAnalyticsEvent) {
		return;
	}

	runItLater(() => {
		createAnalyticsEvent(body).fire(ANALYTICS_CHANNEL);
	});
};
/** Above lines are copied from teams common analytics */

const TEAM_SUBJECT = 'teamProfileCard';
const USER_SUBJECT = 'profilecard';
const AGENT_SUBJECT = 'rovoAgentProfilecard';

const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	actionSubjectId?: string,
	attributes: GenericAttributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	actionSubjectId,
	attributes: {
		packageName: process.env._PACKAGE_NAME_,
		packageVersion: process.env._PACKAGE_VERSION_,
		...attributes,
		firedAt: Math.round(getPageTime()),
	},
});

const getActionSubject = (type: string) => {
	switch (type) {
		case 'user':
			return USER_SUBJECT;
		case 'team':
			return TEAM_SUBJECT;
		case 'agent':
			return AGENT_SUBJECT;
		default:
			return 'user';
	}
};

export const cardTriggered = (type: ProfileType, method: 'hover' | 'click', teamId?: string) => {
	return createEvent('ui', 'triggered', getActionSubject(type), undefined, {
		method,
		...(type === 'team' && teamId ? { teamId } : {}),
	});
};

export const teamRequestAnalytics = (
	action: 'triggered' | 'succeeded' | 'failed',
	attributes?: { duration: number } & GenericAttributes,
) => createEvent('operational', action, TEAM_SUBJECT, 'request', attributes);

export const userRequestAnalytics = (
	action: 'triggered' | 'succeeded' | 'failed',
	attributes?: { duration: number } & GenericAttributes,
) => createEvent('operational', action, USER_SUBJECT, 'request', attributes);

export const profileCardRendered = (
	type: ProfileType,
	actionSubjectId: 'spinner' | 'content' | 'error' | 'errorBoundary',
	attributes?: {
		duration?: number;
		errorType?: 'default' | 'NotFound';
		hasRetry?: boolean;
		numActions?: number;
		memberCount?: number;
		includingYou?: boolean;
		descriptionLength?: number;
		titleLength?: number;
	},
) => createEvent('ui', 'rendered', getActionSubject(type), actionSubjectId, attributes);

export const actionClicked = (
	type: ProfileType,
	attributes: {
		duration: number;
		hasHref: boolean;
		hasOnClick: boolean;
		index: number;
		actionId: string;
	},
) => createEvent('ui', 'clicked', getActionSubject(type), 'action', attributes);

export const reportingLinesClicked = (attributes: {
	userType: 'manager' | 'direct-report';
	duration: number;
}) => createEvent('ui', 'clicked', USER_SUBJECT, 'reportingLines', attributes);

export const moreActionsClicked = (
	type: ProfileType,
	attributes: {
		duration: number;
		numActions: number;
	},
) => createEvent('ui', 'clicked', getActionSubject(type), 'moreActions', attributes);

export const teamAvatarClicked = (attributes: {
	duration: number;
	hasHref: boolean;
	hasOnClick: boolean;
	index: number;
}) => createEvent('ui', 'clicked', TEAM_SUBJECT, 'avatar', attributes);

export const moreMembersClicked = (attributes: { duration: number; memberCount: number }) =>
	createEvent('ui', 'clicked', TEAM_SUBJECT, 'moreMembers', attributes);

export const errorRetryClicked = (attributes: { duration: number }) =>
	createEvent('ui', 'clicked', TEAM_SUBJECT, 'errorRetry', attributes);

export const agentRequestAnalytics = (
	action: 'triggered' | 'succeeded' | 'failed',
	actionSubjectId?: string,
	attributes?: { duration: number } & GenericAttributes,
) => createEvent('operational', action, AGENT_SUBJECT, actionSubjectId || 'request', attributes);

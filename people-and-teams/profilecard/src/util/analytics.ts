import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { type ErrorAttributes } from '../client/types';

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

export const cardTriggered = (
  type: 'user' | 'team',
  method: 'hover' | 'click',
) =>
  createEvent(
    'ui',
    'triggered',
    type === 'user' ? USER_SUBJECT : TEAM_SUBJECT,
    undefined,
    { method },
  );

export const teamRequestAnalytics = (
  action: 'triggered' | 'succeeded' | 'failed',
  attributes?: { duration: number } & GenericAttributes,
) => createEvent('operational', action, TEAM_SUBJECT, 'request', attributes);

export const userRequestAnalytics = (
  action: 'triggered' | 'succeeded' | 'failed',
  attributes?: { duration: number } & GenericAttributes,
) => createEvent('operational', action, USER_SUBJECT, 'request', attributes);

export const profileCardRendered = (
  type: 'user' | 'team',
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
) =>
  createEvent(
    'ui',
    'rendered',
    type === 'user' ? USER_SUBJECT : TEAM_SUBJECT,
    actionSubjectId,
    attributes,
  );

export const actionClicked = (
  type: 'user' | 'team',
  attributes: {
    duration: number;
    hasHref: boolean;
    hasOnClick: boolean;
    index: number;
    actionId: string;
  },
) =>
  createEvent(
    'ui',
    'clicked',
    type === 'user' ? USER_SUBJECT : TEAM_SUBJECT,
    'action',
    attributes,
  );

export const reportingLinesClicked = (attributes: {
  userType: 'manager' | 'direct-report';
  duration: number;
}) => createEvent('ui', 'clicked', USER_SUBJECT, 'reportingLines', attributes);

export const moreActionsClicked = (
  type: 'user' | 'team',
  attributes: {
    duration: number;
    numActions: number;
  },
) =>
  createEvent(
    'ui',
    'clicked',
    type === 'user' ? USER_SUBJECT : TEAM_SUBJECT,
    'moreActions',
    attributes,
  );

export const teamAvatarClicked = (attributes: {
  duration: number;
  hasHref: boolean;
  hasOnClick: boolean;
  index: number;
}) => createEvent('ui', 'clicked', TEAM_SUBJECT, 'avatar', attributes);

export const moreMembersClicked = (attributes: {
  duration: number;
  memberCount: number;
}) => createEvent('ui', 'clicked', TEAM_SUBJECT, 'moreMembers', attributes);

export const errorRetryClicked = (attributes: { duration: number }) =>
  createEvent('ui', 'clicked', TEAM_SUBJECT, 'errorRetry', attributes);

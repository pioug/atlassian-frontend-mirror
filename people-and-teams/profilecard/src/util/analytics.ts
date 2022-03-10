import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { getPageTime } from './performance';

/** Below lines are copied from teams common analytics */
const ANALYTICS_CHANNEL = 'peopleTeams';

const runItLater = (cb: (arg: any) => void) => {
  if ((window as any).requestIdleCallback === 'function') {
    return (window as any).requestIdleCallback(cb);
  }

  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(cb);
  }

  return () => setTimeout(cb);
};

interface AnalyticsEvent {
  action?: string;
  actionSubject?: string;
  actionSubjectId?: string;
  attributes?: Record<string, string | number | boolean | undefined>;
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

const createEvent = (
  eventType: 'ui' | 'operational',
  action: string,
  actionSubject: string,
  actionSubjectId?: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  actionSubjectId,
  attributes: {
    packageName: process.env._PACKAGE_NAME_,
    packageVersion: process.env._PACKAGE_VERSION_,
    ...attributes,
    firedAt: getPageTime(),
  },
});

export const teamCardTriggered = (method: 'hover' | 'click') =>
  createEvent('ui', 'triggered', TEAM_SUBJECT, undefined, { method });

export const teamRequestAnalytics = (
  action: 'triggered' | 'succeeded' | 'failed',
  attributes?: { duration: number } & Record<
    string,
    string | number | boolean | undefined
  >,
) => createEvent('operational', action, TEAM_SUBJECT, 'request', attributes);

export const teamProfileCardRendered = (
  actionSubjectId: 'spinner' | 'content' | 'error' | 'errorBoundary',
  attributes: {
    duration: number;
    hasRetry?: boolean;
    numActions?: number;
    memberCount?: number;
    includingYou?: boolean;
    descriptionLength?: number;
    titleLength?: number;
  },
) => createEvent('ui', 'rendered', TEAM_SUBJECT, actionSubjectId, attributes);

export const teamActionClicked = (attributes: {
  duration: number;
  hasHref: boolean;
  hasOnClick: boolean;
  index: number;
  actionId: string;
}) => createEvent('ui', 'clicked', TEAM_SUBJECT, 'action', attributes);

export const moreActionsClicked = (attributes: {
  duration: number;
  numActions: number;
}) => createEvent('ui', 'clicked', TEAM_SUBJECT, 'moreActions', attributes);

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

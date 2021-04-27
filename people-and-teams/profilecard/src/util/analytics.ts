import {
  AnalyticsEventPayload,
  createAndFireEvent,
} from '@atlaskit/analytics-next';

import { getPageTime } from './performance';

const PEOPLE_TEAMS_CHANNEL = 'peopleTeams';

export const firePeopleTeamsEvent = createAndFireEvent(PEOPLE_TEAMS_CHANNEL);

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
    string | number | undefined
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

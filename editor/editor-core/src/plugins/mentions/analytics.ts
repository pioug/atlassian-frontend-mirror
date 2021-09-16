import {
  EventType,
  GasPayload,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import {
  isSpecialMention,
  MentionDescription,
} from '@atlaskit/mention/resource';
import { InviteExperimentCohort, UserRole } from '@atlaskit/mention';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { isTeamType } from './utils';
import { TeamInfoAttrAnalytics } from './types';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

const componentName = 'mention';

export const buildAnalyticsPayload = (
  actionSubject: string,
  action: string,
  eventType: EventType,
  sessionId: string,
  otherAttributes = {},
): GasPayload => ({
  action,
  actionSubject,
  eventType,
  attributes: {
    packageName,
    packageVersion,
    componentName,
    sessionId,
    ...otherAttributes,
  },
});

type QueryAttributes = Partial<{
  queryLength: number;
  spaceInQuery: boolean;
}>;

const emptyQueryResponse: QueryAttributes = {
  queryLength: 0,
  spaceInQuery: false,
};

const extractAttributesFromQuery = (query?: string): QueryAttributes => {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1,
    };
  }
  return emptyQueryResponse;
};

export const buildTypeAheadCancelPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  sessionId: string,
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload(
    'mentionTypeahead',
    'cancelled',
    UI_EVENT_TYPE,
    sessionId,
    {
      duration,
      downKeyCount,
      upKeyCount,
      queryLength,
      spaceInQuery,
    },
  );
};

const getPosition = (
  mentionList: MentionDescription[] | undefined,
  selectedMention: MentionDescription,
): number | undefined => {
  if (mentionList) {
    const index = mentionList.findIndex(
      (mention) => mention.id === selectedMention.id,
    );
    return index === -1 ? undefined : index;
  }
  return;
};

const isClicked = (insertType: SelectItemMode) => insertType === 'selected';

export const buildTypeAheadInviteItemViewedPayload = (
  sessionId: string,
  contextIdentifierProvider?: ContextIdentifierProvider,
  userRole?: UserRole,
): GasPayload => {
  const { containerId, objectId, childObjectId } = (contextIdentifierProvider ||
    {}) as ContextIdentifierProvider;

  return buildAnalyticsPayload(
    'inviteItem',
    'rendered',
    UI_EVENT_TYPE,
    sessionId,
    {
      containerId,
      objectId,
      childObjectId,
      userRole,
    },
  );
};

export const buildTypeAheadInviteExposurePayload = (
  sessionId: string,
  contextIdentifierProvider?: ContextIdentifierProvider,
  inviteExperimentCohort?: InviteExperimentCohort,
  userRole?: UserRole,
): GasPayload => {
  const { containerId, objectId, childObjectId } = (contextIdentifierProvider ||
    {}) as ContextIdentifierProvider;
  return buildAnalyticsPayload(
    'feature',
    'exposed',
    OPERATIONAL_EVENT_TYPE,
    sessionId,
    {
      flagKey: 'confluence.frontend.invite.from.mention',
      value: inviteExperimentCohort || 'not-enrolled',
      containerId,
      objectId,
      childObjectId,
      userRole,
    },
  );
};

export const buildTypeAheadInviteItemClickedPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  sessionId: string,
  insertType: SelectItemMode,
  query?: string,
  contextIdentifierProvider?: ContextIdentifierProvider,
  userRole?: UserRole,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  const { containerId, objectId, childObjectId } = (contextIdentifierProvider ||
    {}) as ContextIdentifierProvider;

  return buildAnalyticsPayload(
    'inviteItem',
    isClicked(insertType) ? 'clicked' : 'pressed',
    UI_EVENT_TYPE,
    sessionId,
    {
      duration,
      queryLength,
      spaceInQuery,
      upKeyCount,
      downKeyCount,
      containerId,
      objectId,
      childObjectId,
      userRole,
    },
  );
};

export const buildTypeAheadInsertedPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  sessionId: string,
  insertType: SelectItemMode,
  mention: MentionDescription,
  mentionList?: MentionDescription[],
  query?: string,
  contextIdentifierProvider?: ContextIdentifierProvider,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  let analyticsPayload = buildAnalyticsPayload(
    'mentionTypeahead',
    isClicked(insertType) ? 'clicked' : 'pressed',
    UI_EVENT_TYPE,
    sessionId,
    {
      duration,
      position: getPosition(mentionList, mention),
      keyboardKey: isClicked(insertType) ? undefined : insertType,
      source: mention.source,
      queryLength,
      spaceInQuery,
      isSpecial: isSpecialMention(mention),
      accessLevel: mention.accessLevel || '',
      userType: mention.userType,
      userId: mention.id,
      upKeyCount,
      downKeyCount,
      memberCount:
        isTeamType(mention.userType) && mention.context
          ? mention.context.memberCount
          : null,
      includesYou:
        isTeamType(mention.userType) && mention.context
          ? mention.context.includesYou
          : null,
    },
  );

  if (contextIdentifierProvider) {
    analyticsPayload.containerId =
      contextIdentifierProvider.containerId || undefined;
    analyticsPayload.objectId = contextIdentifierProvider.objectId || undefined;
    analyticsPayload.childObjectId =
      contextIdentifierProvider.childObjectId || undefined;
  }

  return analyticsPayload;
};

export const buildTypeAheadRenderedPayload = (
  duration: number,
  userIds: Array<string> | null,
  query: string,
  teams: TeamInfoAttrAnalytics[] | null,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  const actionSubject = userIds ? 'mentionTypeahead' : 'teamMentionTypeahead';

  return {
    action: 'rendered',
    actionSubject,
    eventType: OPERATIONAL_EVENT_TYPE,
    attributes: {
      packageName,
      packageVersion,
      componentName,
      duration,
      userIds,
      teams,
      queryLength,
      spaceInQuery,
    },
  };
};

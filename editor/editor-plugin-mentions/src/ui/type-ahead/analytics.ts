import {
	ACTION,
	ACTION_SUBJECT,
	type AnalyticsEventPayload,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { UserRole } from '@atlaskit/mention';
import type { MentionDescription } from '@atlaskit/mention/resource';
import { isSpecialMention } from '@atlaskit/mention/resource';

import type { TeamInfoAttrAnalytics } from '../../types';

import { isTeamType } from './utils';

const componentName = 'mention';

export const MENTION_SOURCE = 'mentionInEditor';

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
): AnalyticsEventPayload => {
	const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
	return {
		action: ACTION.CANCELLED,
		actionSubject: ACTION_SUBJECT.MENTION_TYPEAHEAD,
		eventType: EVENT_TYPE.UI,
		attributes: {
			componentName,
			duration,
			queryLength,
			spaceInQuery,
			upKeyCount,
			downKeyCount,
			sessionId,
		},
	};
};

const getPosition = (
	mentionList: MentionDescription[] | undefined,
	selectedMention: MentionDescription,
): number | undefined => {
	if (mentionList) {
		const index = mentionList.findIndex((mention) => mention.id === selectedMention.id);
		return index === -1 ? undefined : index;
	}
	return;
};

const isClicked = (insertType: SelectItemMode) => insertType === 'selected';

export const buildTypeAheadInviteItemViewedPayload = (
	sessionId: string,
	contextIdentifierProvider?: ContextIdentifierProvider,
	userRole?: UserRole,
	additionalAttributes?: Record<string, unknown>,
): AnalyticsEventPayload => {
	const { containerId, objectId, childObjectId } = (contextIdentifierProvider ||
		{}) as ContextIdentifierProvider;

	return {
		action: ACTION.RENDERED,
		actionSubject: ACTION_SUBJECT.INVITE_ITEM,
		eventType: EVENT_TYPE.UI,
		attributes: {
			componentName,
			containerId,
			objectId,
			childObjectId,
			userRole,
			sessionId,
			source: MENTION_SOURCE,
			...additionalAttributes,
		},
	};
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
	additionalAttributes?: Record<string, unknown>,
): AnalyticsEventPayload => {
	const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
	const { containerId, objectId, childObjectId } = (contextIdentifierProvider ||
		{}) as ContextIdentifierProvider;

	return {
		action: isClicked(insertType) ? ACTION.CLICKED : ACTION.PRESSED,
		actionSubject: ACTION_SUBJECT.INVITE_ITEM,
		eventType: EVENT_TYPE.UI,
		attributes: {
			componentName,
			duration,
			queryLength,
			spaceInQuery,
			upKeyCount,
			downKeyCount,
			containerId,
			objectId,
			childObjectId,
			userRole,
			sessionId,
			keyboardKey: isClicked(insertType) ? undefined : insertType,
			...additionalAttributes,
		},
	};
};

export const buildTypeAheadInsertedPayload = (
	duration: number,
	upKeyCount: number,
	downKeyCount: number,
	sessionId: string,
	insertType: SelectItemMode,
	mention: MentionDescription,
	mentionLocalId: string,
	mentionList?: MentionDescription[],
	query?: string,
	contextIdentifierProvider?: ContextIdentifierProvider,
	taskListId?: string,
	taskItemId?: string,
): AnalyticsEventPayload => {
	const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
	let containerId;
	let objectId;
	let childObjectId;

	if (contextIdentifierProvider) {
		containerId = contextIdentifierProvider.containerId || undefined;
		objectId = contextIdentifierProvider.objectId || undefined;
		childObjectId = contextIdentifierProvider.childObjectId || undefined;
	}

	return {
		action: isClicked(insertType) ? ACTION.CLICKED : ACTION.PRESSED,
		actionSubject: ACTION_SUBJECT.MENTION_TYPEAHEAD,
		eventType: EVENT_TYPE.UI,
		containerId,
		objectId,
		childObjectId,
		attributes: {
			sessionId,
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
				isTeamType(mention.userType) && mention.context ? mention.context.memberCount : null,
			includesYou:
				isTeamType(mention.userType) && mention.context ? mention.context.includesYou : null,
			taskListId,
			taskItemId,
			localId: mentionLocalId,
			containerId,
			objectId,
			childObjectId,
		},
	};
};

export const buildTypeAheadRenderedPayload = (
	duration: number,
	userIds: Array<string> | null,
	query: string,
	teams: TeamInfoAttrAnalytics[] | null,
	xProductMentionsLength: number,
): AnalyticsEventPayload => {
	const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
	const actionSubject = userIds
		? ACTION_SUBJECT.MENTION_TYPEAHEAD
		: ACTION_SUBJECT.TEAM_MENTION_TYPEAHEAD;

	return {
		action: ACTION.RENDERED,
		actionSubject,
		eventType: EVENT_TYPE.OPERATIONAL,
		attributes: {
			componentName,
			duration,
			userIds,
			teams,
			queryLength,
			spaceInQuery,
			xProductMentionsLength,
		},
	};
};

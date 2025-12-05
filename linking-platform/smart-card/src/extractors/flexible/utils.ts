import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntity,
	extractPersonAssignedTo,
	extractPersonCreatedBy,
	extractPersonOwnedBy,
	extractPersonUpdatedBy,
	extractSmartLinkUrl,
	isEntityPresent,
	type LinkPerson,
	type LinkTypeUpdatedBy,
} from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

import { type LinkLocation } from '../../state/flexible-ui-context/types';

const extractLinkName = (link?: JsonLd.Primitives.Link): string | undefined => {
	if (link && typeof link === 'object' && link['@type'] === 'Link') {
		return link.name;
	}
};

const extractValue = <TData extends JsonLd.Data.BaseData, TResult>(
	data: JsonLd.Data.BaseData,
	key: keyof TData,
): TResult | undefined => {
	return (data as TData)?.[key] as unknown as TResult;
};

export type LinkCommentType =
	| JsonLd.Data.Document
	| JsonLd.Data.Page
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.TaskType;
export const extractCommentCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkCommentType, number>(data, 'schema:commentCount');

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkCommentCount = (response?: SmartLinkResponse): number | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		return entity && 'commentCount' in entity && typeof entity.commentCount === 'number'
			? entity?.commentCount
			: undefined;
	}

	return response?.data && extractCommentCount(response?.data as JsonLd.Data.BaseData);
};

export const extractAppliedToComponentsCount = (data: JsonLd.Data.BaseData) =>
	extractValue<JsonLd.Data.Project, number>(data, 'atlassian:appliedToComponentsCount');

export const extractDueOn = (data: JsonLd.Data.BaseData) =>
	extractValue<JsonLd.Data.BaseData, string>(data, 'endTime');

type LinkViewCountType = JsonLd.Data.Document | JsonLd.Data.SourceCodeRepository | JsonLd.Data.Task;
export const extractViewCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkViewCountType, number>(data, 'atlassian:viewCount');

type LinkReactCountType =
	| JsonLd.Data.Document
	| JsonLd.Data.Message
	| JsonLd.Data.Project
	| JsonLd.Data.Task;
export const extractReactCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkReactCountType, number>(data, 'atlassian:reactCount');

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkReactCount = (response?: SmartLinkResponse): number | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		const reactions =
			entity && 'reactions' in entity && Array.isArray(entity.reactions)
				? entity.reactions
				: undefined;
		return reactions?.reduce((total, reaction) => total + reaction?.total, 0);
	}

	return response?.data && extractReactCount(response?.data as JsonLd.Data.BaseData);
};

type LinkVoteCountType =
	| JsonLd.Data.Document
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task;
export const extractVoteCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkVoteCountType, number>(data, 'atlassian:voteCount');

export const extractOwnedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const persons = extractPersonOwnedBy(data);
	if (persons && persons.length) {
		return persons[0].name;
	}
};

export const extractAssignedTo = (data: JsonLd.Data.BaseData): string | undefined => {
	const person = extractPersonAssignedTo(data as JsonLd.Data.Task | JsonLd.Data.TaskType);
	if (person) {
		return person.name;
	}
};

export const extractPersonAssignedToAsArray = (
	data: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
	const person = extractPersonAssignedTo(data as JsonLd.Data.Task | JsonLd.Data.TaskType);
	return person ? [person] : undefined;
};

export const extractCreatedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const persons = extractPersonCreatedBy(data);
	if (persons && persons.length) {
		return persons[0].name;
	}
};

export const extractModifiedBy = (data: JsonLd.Data.BaseData): string | undefined => {
	const person = extractPersonUpdatedBy(data as LinkTypeUpdatedBy);
	if (person) {
		return person.name;
	}
};

export type LinkProgrammingLanguageType =
	| JsonLd.Data.SourceCodeDocument
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository;
export const extractProgrammingLanguage = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkProgrammingLanguageType, string>(data, 'schema:programmingLanguage');

export const extractSourceBranch = (data: JsonLd.Data.SourceCodePullRequest): string | undefined =>
	extractLinkName(data['atlassian:mergeSource'] as JsonLd.Primitives.Link);

export type LinkSubscriberType =
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType;
export const extractSubscriberCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkSubscriberType, number>(data, 'atlassian:subscriberCount');

export const extractTeamMemberCount = (data: JsonLd.Data.BaseData) => {
	const val = data?.attributedTo
		? Array.isArray(data?.attributedTo)
			? data?.attributedTo.length
			: 0
		: 0;
	return val;
};

export type LinkAttachmentType =
	| JsonLd.Data.Document
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType
	| JsonLd.Data.Project;
export const extractAttachmentCount = (data: JsonLd.Data.BaseData) =>
	extractValue<LinkAttachmentType, number>(data, 'atlassian:attachmentCount');

export const extractTargetBranch = (data: JsonLd.Data.SourceCodePullRequest): string | undefined =>
	extractLinkName(data['atlassian:mergeDestination'] as JsonLd.Primitives.Link);

type LinkChecklistProgressType =
	| JsonLd.Data.Document
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType
	| JsonLd.Data.Project;
export const extractChecklistProgress = (data: JsonLd.Data.BaseData) => {
	const checkItemsObj = extractValue<
		LinkChecklistProgressType,
		LinkChecklistProgressType['atlassian:checkItems']
	>(data, 'atlassian:checkItems');
	return checkItemsObj ? `${checkItemsObj.checkedItems}/${checkItemsObj.totalItems}` : undefined;
};

export const extractLocation = (data: JsonLd.Data.BaseData): LinkLocation | undefined => {
	const { url, name } =
		(extractValue<JsonLd.Data.BaseData, JsonLd.Data.Project['location']>(
			data,
			'location',
		) as JsonLd.Data.Project) || {};

	if (url && name && typeof url === 'string') {
		return {
			text: name,
			url,
		};
	}
};

export const extractSubTasksProgress = (data: JsonLd.Data.BaseData): string | undefined => {
	const subTasksObject = extractValue<JsonLd.Data.Task, JsonLd.Primitives.SubTasksProgress>(
		data,
		'atlassian:subTasks',
	);
	return subTasksObject && subTasksObject.totalCount
		? `${subTasksObject.resolvedCount}/${subTasksObject.totalCount}`
		: undefined;
};

export const extractUserAttributes = (
	data: JsonLd.Data.BaseData,
): JsonLd.Primitives.UserAttributes | undefined => {
	return data?.userAttributes;
};

export const extractReadTime = (data: JsonLd.Data.BaseData): string | undefined => {
	return extractValue<JsonLd.Data.Document, string>(data, 'atlassian:readTimeInMinutes');
};

export const extractSentOn = (data: JsonLd.Data.BaseData): string | undefined => {
	return extractValue<JsonLd.Data.Message, string>(data, 'dateSent');
};

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export const extractSmartLinkSentOn = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdAt;
	}

	return response?.data && extractSentOn(response?.data as JsonLd.Data.BaseData);
};

export const extractStoryPoints = (data: JsonLd.Data.BaseData): number | undefined => {
	return extractValue<JsonLd.Data.Task, number>(data, 'atlassian:storyPoints');
};

export const extractMetaObjectId = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.objectId;
export const extractMetaResourceType = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.resourceType;
export const extractMetaTenantId = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.tenantId;

export const extractHostName = (response?: SmartLinkResponse): string | undefined => {
	try {
		const url = extractSmartLinkUrl(response);
		const hostName = url ? new URL(url).hostname : undefined;
		return hostName;
	} catch {
		return undefined;
	}
};

import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractAri,
	extractDateCreated,
	extractDateUpdated,
	extractLink,
	extractPersonCreatedBy,
	extractPersonOwnedBy,
	extractSmartLinkAri,
	extractSmartLinkCreatedBy,
	extractSmartLinkCreatedOn,
	extractSmartLinkModifiedBy,
	extractSmartLinkModifiedOn,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractTitle,
	extractType,
	type LinkTypeCreated,
} from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { type ExtractFlexibleUiDataContextParams } from '../../view/FlexibleCard/types';
import { extractSummary } from '../common/primitives';

import { extractFlexibleCardActions } from './actions';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import extractPreview, { extractSmartLinkPreviewImage } from './extract-preview';
import extractPriority from './extract-priority';
import extractState from './extract-state';
import { extractLinkIcon, extractSmartLinkIcon } from './icon';
import extractProviderIcon, { extractSmartLinkProviderIcon } from './icon/extract-provider-icon';
import { extractLatestCommit, type LinkTypeLatestCommit } from './latest-commit';
import {
	extractAppliedToComponentsCount,
	extractAssignedTo,
	extractAttachmentCount,
	extractChecklistProgress,
	extractCommentCount,
	extractCreatedBy,
	extractDueOn,
	extractLocation,
	extractModifiedBy,
	extractOwnedBy,
	extractPersonAssignedToAsArray,
	extractProgrammingLanguage,
	extractReactCount,
	extractReadTime,
	extractSentOn,
	extractSourceBranch,
	extractStoryPoints,
	extractSubscriberCount,
	extractSubTasksProgress,
	extractTargetBranch,
	extractViewCount,
	extractVoteCount,
} from './utils';

const extractFlexibleUiContextFromJsonLd = ({
	appearance,
	fireEvent,
	id,
	origin,
	renderers,
	resolve,
	actionOptions,
	response,
	aiSummaryConfig,
	...props
}: Partial<ExtractFlexibleUiDataContextParams> = {}): FlexibleUiDataContext | undefined => {
	if (!response) {
		return undefined;
	}
	const data = response.data as JsonLd.Data.BaseData;

	const url = extractLink(data);

	return {
		actions: extractFlexibleCardActions({
			actionOptions,
			aiSummaryConfig,
			appearance,
			fireEvent,
			id,
			origin,
			response,
			url: props.url, // Use the original URL in edge cases, such as short links for AI summary and copy link actions.
		}),
		appliedToComponentsCount: extractAppliedToComponentsCount(data),
		assignedToGroup: extractPersonAssignedToAsArray(
			data as JsonLd.Data.Task | JsonLd.Data.TaskType,
		),
		attachmentCount: extractAttachmentCount(data),
		authorGroup: extractPersonCreatedBy(data),
		ownedByGroup: extractPersonOwnedBy(data),
		collaboratorGroup: extractPersonsUpdatedBy(data as JsonLd.Data.Document),
		commentCount: extractCommentCount(data),
		viewCount: extractViewCount(data),
		reactCount: extractReactCount(data),
		voteCount: extractVoteCount(data),
		checklistProgress: extractChecklistProgress(data),
		createdBy: extractCreatedBy(data),
		ownedBy: extractOwnedBy(data),
		assignedTo: extractAssignedTo(data),
		createdOn: extractDateCreated(data as LinkTypeCreated),
		dueOn: extractDueOn(data),
		latestCommit: extractLatestCommit(data as LinkTypeLatestCommit),
		linkIcon: extractLinkIcon(response, renderers),
		location: extractLocation(data),
		modifiedBy: extractModifiedBy(data),
		modifiedOn: extractDateUpdated(data),
		preview: extractPreview(data),
		priority: extractPriority(data as JsonLd.Data.Task),
		provider: extractProviderIcon(data),
		programmingLanguage: extractProgrammingLanguage(data),
		readTime: extractReadTime(data),
		sentOn: extractSentOn(data),
		snippet: extractSummary(data) || undefined, // Explicitly set here to remove an empty string
		sourceBranch: extractSourceBranch(data as JsonLd.Data.SourceCodePullRequest),
		state: extractState(response, actionOptions, id, appearance, origin, fireEvent, resolve),
		subscriberCount: extractSubscriberCount(data),
		subTasksProgress: extractSubTasksProgress(data),
		storyPoints: extractStoryPoints(data),
		targetBranch: extractTargetBranch(data as JsonLd.Data.SourceCodePullRequest),
		title: extractTitle(data) || url,
		url,
		ari: extractAri(data),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(data),
		}),
	};
};

const extractFlexibleUiContextFromEntity = ({
	actionOptions,
	appearance,
	fireEvent,
	id,
	origin,
	resolve,
	response,
}: Partial<ExtractFlexibleUiDataContextParams> = {}): FlexibleUiDataContext | undefined => {
	if (!response) {
		return undefined;
	}

	const data = response.data as JsonLd.Data.BaseData;
	const url = extractSmartLinkUrl(response);

	return {
		actions: extractFlexibleCardActions({
			response,
			actionOptions,
			id,
			appearance,
			fireEvent,
		}),
		url,
		ari: extractSmartLinkAri(response),
		title: extractSmartLinkTitle(response) || url,
		linkIcon: extractSmartLinkIcon(response),
		preview: extractSmartLinkPreviewImage(response),
		provider: extractSmartLinkProviderIcon(response),
		modifiedOn: extractSmartLinkModifiedOn(response),
		createdOn: extractSmartLinkCreatedOn(response),
		createdBy: extractSmartLinkCreatedBy(response),
		modifiedBy: extractSmartLinkModifiedBy(response),
		// We need to add/remove these as we support new entity types
		assignedToGroup: extractPersonAssignedToAsArray(
			data as JsonLd.Data.Task | JsonLd.Data.TaskType,
		),
		appliedToComponentsCount: extractAppliedToComponentsCount(data),
		attachmentCount: extractAttachmentCount(data),
		authorGroup: extractPersonCreatedBy(data),
		ownedByGroup: extractPersonOwnedBy(data),
		collaboratorGroup: extractPersonsUpdatedBy(data as JsonLd.Data.Document),
		commentCount: extractCommentCount(data),
		viewCount: extractViewCount(data),
		reactCount: extractReactCount(data),
		voteCount: extractVoteCount(data),
		checklistProgress: extractChecklistProgress(data),
		ownedBy: extractOwnedBy(data),
		assignedTo: extractAssignedTo(data),
		dueOn: extractDueOn(data),
		latestCommit: extractLatestCommit(data as LinkTypeLatestCommit),
		location: extractLocation(data),
		priority: extractPriority(data as JsonLd.Data.Task),
		programmingLanguage: extractProgrammingLanguage(data),
		readTime: extractReadTime(data),
		sentOn: extractSentOn(data),
		snippet: extractSummary(data) || undefined, // Explicitly set here to remove an empty string
		sourceBranch: extractSourceBranch(data as JsonLd.Data.SourceCodePullRequest),
		state: extractState(response, actionOptions, id, appearance, origin, fireEvent, resolve),
		subscriberCount: extractSubscriberCount(data),
		subTasksProgress: extractSubTasksProgress(data),
		storyPoints: extractStoryPoints(data),
		targetBranch: extractTargetBranch(data as JsonLd.Data.SourceCodePullRequest),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(data),
		}),
	};
};

const extractFlexibleUiContext = (
	props: Partial<ExtractFlexibleUiDataContextParams> = {},
): FlexibleUiDataContext | undefined => {
	if (fg('smart_links_noun_support')) {
		return extractFlexibleUiContextFromEntity(props);
	}
	return extractFlexibleUiContextFromJsonLd(props);
};

export default extractFlexibleUiContext;

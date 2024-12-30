import { type JsonLd } from 'json-ld-types';

import {
	extractAri,
	extractDateCreated,
	extractDateUpdated,
	extractLink,
	extractPersonCreatedBy,
	extractPersonOwnedBy,
	extractTitle,
	type LinkTypeCreated,
} from '@atlaskit/link-extractors';

import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { type ExtractFlexibleUiDataContextParams } from '../../view/FlexibleCard/types';
import { extractSummary } from '../common/primitives';

import { extractFlexibleCardActions } from './actions';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import extractPreview from './extract-preview';
import extractPriority from './extract-priority';
import extractState from './extract-state';
import { extractLinkIcon } from './icon';
import extractProviderIcon from './icon/extract-provider-icon';
import { extractLatestCommit, type LinkTypeLatestCommit } from './latest-commit';
import {
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

const extractFlexibleUiContext = ({
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
	};
};

export default extractFlexibleUiContext;

import { type JsonLd } from 'json-ld-types';
import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { extractSummary } from '../common/primitives';
import extractActions from './actions';
import { extractLinkIcon } from './icon';
import {
	extractAttachmentCount,
	extractChecklistProgress,
	extractCommentCount,
	extractCreatedBy,
	extractModifiedBy,
	extractProgrammingLanguage,
	extractSubscriberCount,
	extractViewCount,
	extractReactCount,
	extractVoteCount,
	extractSourceBranch,
	extractTargetBranch,
	extractDueOn,
	extractLocation,
	extractOwnedBy,
	extractAssignedTo,
	extractSubTasksProgress,
	extractStoryPoints,
	extractReadTime,
	extractSentOn,
	extractPersonAssignedToAsArray,
} from './utils';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import {
	extractPersonCreatedBy,
	extractTitle,
	extractDateUpdated,
	extractDateCreated,
	type LinkTypeCreated,
	extractLink,
	extractPersonOwnedBy,
	extractAri,
} from '@atlaskit/link-extractors';
import extractPriority from './extract-priority';
import extractProviderIcon from './icon/extract-provider-icon';
import extractPreview from './extract-preview';
import extractState from './extract-state';
import { extractLatestCommit, type LinkTypeLatestCommit } from './latest-commit';
import { extractViewAction } from './actions/extract-view-action';
import { type ExtractFlexibleUiDataContextParams } from '../../view/FlexibleCard/types';

const extractFlexibleUiContext = ({
	id,
	renderers,
	actionOptions,
	response,
	aiSummaryConfig,
}: Partial<ExtractFlexibleUiDataContextParams> = {}): FlexibleUiDataContext | undefined => {
	if (!response) {
		return undefined;
	}
	const data = response.data as JsonLd.Data.BaseData;

	const url = extractLink(data);

	return {
		actions: extractActions(response, url, actionOptions, id, aiSummaryConfig),
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
		viewAction: extractViewAction(data, actionOptions),
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
		state: extractState(response, actionOptions, id),
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

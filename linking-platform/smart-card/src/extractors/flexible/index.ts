import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractPersonOwnedBy,
	extractSmartLinkAri,
	extractSmartLinkAuthorGroup,
	extractSmartLinkCreatedBy,
	extractSmartLinkCreatedOn,
	extractSmartLinkModifiedBy,
	extractSmartLinkModifiedOn,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractType,
} from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { type ExtractFlexibleUiDataContextParams } from '../../view/FlexibleCard/types';
import { extractSmartLinkSummary } from '../common/primitives/extractSummary';

import { extractFlexibleCardActions } from './actions';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import extractLinkTitle from './extract-link-title';
import { extractSmartLinkPreviewImage } from './extract-preview';
import extractPriority from './extract-priority';
import extractState from './extract-state';
import { extractSmartLinkIcon } from './icon';
import { extractSmartLinkProviderIcon } from './icon/extract-provider-icon';
import { extractLatestCommit, type LinkTypeLatestCommit } from './latest-commit';
import {
	extractAppliedToComponentsCount,
	extractAssignedTo,
	extractAttachmentCount,
	extractChecklistProgress,
	extractCommentCount,
	extractDueOn,
	extractLocation,
	extractMetaObjectId,
	extractMetaResourceType,
	extractMetaTenantId,
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
	extractTeamMemberCount,
	extractViewCount,
	extractVoteCount,
} from './utils';

const extractFlexibleUiContext = ({
	appearance,
	fireEvent,
	id,
	onClick,
	origin,
	renderers,
	resolve,
	actionOptions,
	response,
	status,
	aiSummaryConfig,
	...props
}: Partial<ExtractFlexibleUiDataContextParams> = {}): FlexibleUiDataContext | undefined => {
	if (!response) {
		return undefined;
	}
	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	const url = extractSmartLinkUrl(response);

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
		authorGroup: extractSmartLinkAuthorGroup(response),
		ownedByGroup: extractPersonOwnedBy(data),
		collaboratorGroup: extractPersonsUpdatedBy(data as JsonLd.Data.Document),
		commentCount: extractCommentCount(data),
		viewCount: extractViewCount(data),
		reactCount: extractReactCount(data),
		voteCount: extractVoteCount(data),
		checklistProgress: extractChecklistProgress(data),
		createdBy: extractSmartLinkCreatedBy(response),
		ownedBy: extractOwnedBy(data),
		assignedTo: extractAssignedTo(data),
		createdOn: extractSmartLinkCreatedOn(response),
		dueOn: extractDueOn(data),
		latestCommit: extractLatestCommit(data as LinkTypeLatestCommit),
		linkIcon: extractSmartLinkIcon(response),
		...(fg('platform-linking-flexible-card-context') && {
			linkTitle: extractLinkTitle(status, props.url, response, onClick),
		}),
		location: extractLocation(data),
		modifiedBy: extractSmartLinkModifiedBy(response),
		modifiedOn: extractSmartLinkModifiedOn(response),
		preview: extractSmartLinkPreviewImage(response),
		priority: extractPriority(data as JsonLd.Data.Task),
		provider: extractSmartLinkProviderIcon(response),
		programmingLanguage: extractProgrammingLanguage(data),
		readTime: extractReadTime(data),
		sentOn: extractSentOn(data),
		snippet: extractSmartLinkSummary(response) || undefined, // Explicitly set here to remove an empty string
		sourceBranch: extractSourceBranch(data as JsonLd.Data.SourceCodePullRequest),
		state: extractState(response, actionOptions, id, appearance, origin, fireEvent, resolve),
		subscriberCount: extractSubscriberCount(data),
		subTasksProgress: extractSubTasksProgress(data),
		storyPoints: extractStoryPoints(data),
		targetBranch: extractTargetBranch(data as JsonLd.Data.SourceCodePullRequest),
		...(fg('platform-linking-flexible-card-context')
			? undefined
			: { title: extractSmartLinkTitle(response) || url }),
		...(fg('platform-linking-team-member-count-component') && {
			teamMemberCount: extractTeamMemberCount(data),
		}),
		url,
		ari: extractSmartLinkAri(response),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(data),
		}),
		...(fg('cc-ai-linking-platform-snippet-renderer') && {
			meta: {
				objectId: extractMetaObjectId(meta),
				resourceType: extractMetaResourceType(meta),
				tenantId: extractMetaTenantId(meta),
			},
		}),
	};
};

export default extractFlexibleUiContext;

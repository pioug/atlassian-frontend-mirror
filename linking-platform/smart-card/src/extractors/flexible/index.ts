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
import extractLinkTitle from './extract-link-title';
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
	extractMetaObjectId,
	extractMetaResourceType,
	extractMetaTenantId,
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

	const url = fg('smart_links_noun_support') ? extractSmartLinkUrl(response) : extractLink(data);

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
		createdBy: fg('smart_links_noun_support')
			? extractSmartLinkCreatedBy(response)
			: extractCreatedBy(data),
		ownedBy: extractOwnedBy(data),
		assignedTo: extractAssignedTo(data),
		createdOn: fg('smart_links_noun_support')
			? extractSmartLinkCreatedOn(response)
			: extractDateCreated(data as LinkTypeCreated),
		dueOn: extractDueOn(data),
		latestCommit: extractLatestCommit(data as LinkTypeLatestCommit),
		linkIcon: fg('smart_links_noun_support')
			? extractSmartLinkIcon(response)
			: extractLinkIcon(response, renderers),
		...(fg('platform-linking-flexible-card-context') && {
			linkTitle: extractLinkTitle(status, props.url, response, onClick),
		}),
		location: extractLocation(data),
		modifiedBy: fg('smart_links_noun_support')
			? extractSmartLinkModifiedBy(response)
			: extractModifiedBy(data),
		modifiedOn: fg('smart_links_noun_support')
			? extractSmartLinkModifiedOn(response)
			: extractDateUpdated(data),
		preview: fg('smart_links_noun_support')
			? extractSmartLinkPreviewImage(response)
			: extractPreview(data),
		priority: extractPriority(data as JsonLd.Data.Task),
		provider: fg('smart_links_noun_support')
			? extractSmartLinkProviderIcon(response)
			: extractProviderIcon(data),
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
		...(fg('platform-linking-flexible-card-context')
			? undefined
			: {
					title: fg('smart_links_noun_support')
						? extractSmartLinkTitle(response) || url
						: extractTitle(data) || url,
				}),
		url,
		ari: fg('smart_links_noun_support') ? extractSmartLinkAri(response) : extractAri(data),
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

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractPersonOwnedBy } from '@atlaskit/link-extractors/extract-person-owned-by';
import { extractSmartLinkAri } from '@atlaskit/link-extractors/extract-smart-link-ari';
import { extractSmartLinkAuthorGroup } from '@atlaskit/link-extractors/extract-smart-link-author-group';
import { extractSmartLinkCreatedBy } from '@atlaskit/link-extractors/extract-smart-link-created-by';
import { extractSmartLinkCreatedOn } from '@atlaskit/link-extractors/extract-smart-link-created-on';
import { extractSmartLinkModifiedBy } from '@atlaskit/link-extractors/extract-smart-link-modified-by';
import { extractSmartLinkModifiedOn } from '@atlaskit/link-extractors/extract-smart-link-modified-on';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import { extractType } from '@atlaskit/link-extractors/extract-type';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { type ExtractFlexibleUiDataContextParams } from '../../view/FlexibleCard/types';
import { extractSmartLinkSummary } from '../common/primitives/extractSmartLinkSummary';
import { extractFlexibleCardActions } from './actions';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import { extractAppliedToComponentsCount } from './extract-applied-to-components-count';
import { extractAssignedTo } from './extract-assigned-to';
import { extractAttachmentCount } from './extract-attachment-count';
import { extractChecklistProgress } from './extract-checklist-progress';
import { extractDueOn } from './extract-due-on';
import { extractHostName } from './extract-host-name';
import extractLinkTitle from './extract-link-title';
import { extractLocation } from './extract-location';
import { extractMetaObjectId } from './extract-meta-object-id';
import { extractMetaResourceType } from './extract-meta-resource-type';
import { extractMetaTenantId } from './extract-meta-tenant-id';
import { extractOwnedBy } from './extract-owned-by';
import { extractPersonAssignedToAsArray } from './extract-person-assigned-to-as-array';
import extractPriority from './extract-priority';
import { extractProgrammingLanguage } from './extract-programming-language';
import extractProvider from './extract-provider';
import { extractReadTime } from './extract-read-time';
import { extractSmartLinkCommentCount } from './extract-smart-link-comment-count';
import { extractSmartLinkPreviewImage } from './extract-smart-link-preview-image';
import { extractSmartLinkReactCount } from './extract-smart-link-react-count';
import { extractSmartLinkSentOn } from './extract-smart-link-sent-on';
import { extractSourceBranch } from './extract-source-branch';
import extractState from './extract-state';
import { extractStoryPoints } from './extract-story-points';
import { extractSubTasksProgress } from './extract-sub-tasks-progress';
import { extractSubscriberCount } from './extract-subscriber-count';
import { extractTargetBranch } from './extract-target-branch';
import { extractTeamMemberCount } from './extract-team-member-count';
import { extractUserAttributes } from './extract-user-attributes';
import { extractViewCount } from './extract-view-count';
import { extractVoteCount } from './extract-vote-count';
import { extractSmartLinkIcon } from './icon/extract-smart-link-icon';
import { extractLatestCommit, type LinkTypeLatestCommit } from './latest-commit';

const extractFlexibleUiContext = ({
	appearance,
	fireEvent,
	id,
	onClick,
	onAuxClick,
	onContextMenu,
	origin,
	product,
	resolve,
	rovoConfig,
	actionOptions,
	response,
	status,
	aiSummaryConfig,
	isPreviewPanelAvailable,
	isPreviewRestricted,
	openPreviewPanel,
	transformUrl,
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
			product,
			rovoConfig,
			response,
			url: props.url, // Use the original URL in edge cases, such as short links for AI summary and copy link actions.
			isPreviewPanelAvailable,
			...(fg('preview_panel_unit_check') ? { isPreviewRestricted } : undefined),
			openPreviewPanel,
			transformUrl,
		}),
		appliedToComponentsCount: extractAppliedToComponentsCount(data),
		assignedToGroup: extractPersonAssignedToAsArray(
			data as JsonLd.Data.Task | JsonLd.Data.TaskType,
		),
		attachmentCount: extractAttachmentCount(data),
		authorGroup: extractSmartLinkAuthorGroup(response),
		ownedByGroup: extractPersonOwnedBy(data),
		collaboratorGroup: extractPersonsUpdatedBy(data as JsonLd.Data.Document),
		commentCount: extractSmartLinkCommentCount(response),
		viewCount: extractViewCount(data),
		reactCount: extractSmartLinkReactCount(response),
		voteCount: extractVoteCount(data),
		checklistProgress: extractChecklistProgress(data),
		createdBy: extractSmartLinkCreatedBy(response),
		ownedBy: extractOwnedBy(data),
		assignedTo: extractAssignedTo(data),
		createdOn: extractSmartLinkCreatedOn(response),
		dueOn: extractDueOn(data),
		latestCommit: extractLatestCommit(data as LinkTypeLatestCommit),
		linkIcon: extractSmartLinkIcon(response),
		linkTitle: extractLinkTitle(status, props.url, response, onClick, onAuxClick, onContextMenu),
		location: extractLocation(data),
		modifiedBy: extractSmartLinkModifiedBy(response),
		modifiedOn: extractSmartLinkModifiedOn(response),
		preview: extractSmartLinkPreviewImage(response),
		priority: extractPriority(data as JsonLd.Data.Task),
		provider: extractProvider(response),
		programmingLanguage: extractProgrammingLanguage(data),
		readTime: extractReadTime(data),
		sentOn: extractSmartLinkSentOn(response),
		snippet: extractSmartLinkSummary(response) || undefined, // Explicitly set here to remove an empty string
		sourceBranch: extractSourceBranch(data as JsonLd.Data.SourceCodePullRequest),
		state: extractState(
			response,
			actionOptions,
			id,
			appearance,
			origin,
			fireEvent,
			resolve,
			isPreviewPanelAvailable,
			openPreviewPanel,
			transformUrl,
			fg('preview_panel_unit_check') ? isPreviewRestricted : undefined,
		),
		subscriberCount: extractSubscriberCount(data),
		subTasksProgress: extractSubTasksProgress(data),
		storyPoints: extractStoryPoints(data),
		targetBranch: extractTargetBranch(data as JsonLd.Data.SourceCodePullRequest),
		userAttributes: extractUserAttributes(data),
		teamMemberCount: extractTeamMemberCount(data),
		url,
		ari: extractSmartLinkAri(response),
		type: extractType(data),
		meta: {
			objectId: extractMetaObjectId(meta),
			resourceType: extractMetaResourceType(meta),
			tenantId: extractMetaTenantId(meta),
		},
		hostName: extractHostName(response),
	};
};

export default extractFlexibleUiContext;

import { JsonLd } from 'json-ld-types';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { extractSummary } from '../common/primitives';
import { extractLozenge } from '../common/lozenge';
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
} from './utils';
import { extractPersonsUpdatedBy } from './collaboratorGroup';
import {
  extractPersonCreatedBy,
  extractTitle,
  extractDateUpdated,
  extractDateCreated,
  LinkTypeCreated,
  extractLink,
} from '@atlaskit/linking-common/extractors';
import extractPriority from './extract-priority';
import extractProviderIcon from './icon/extract-provider-icon';
import extractPreview from './extract-preview';
import { extractLatestCommit } from './latest-commit';
import { extractPreviewAction } from './actions/extract-preview-action';
import { extractDownloadAction } from './actions/extract-download-action';
import { extractViewAction } from './actions/extract-view-action';

const extractFlexibleUiContext = (
  response?: JsonLd.Response,
  renderers?: CardProviderRenderers,
): FlexibleUiDataContext | undefined => {
  if (!response) {
    return undefined;
  }
  const data = response.data as JsonLd.Data.BaseData;
  const url = extractLink(data);
  return {
    attachmentCount: extractAttachmentCount(data),
    authorGroup: extractPersonCreatedBy(data),
    collaboratorGroup: extractPersonsUpdatedBy(data as JsonLd.Data.Document),
    commentCount: extractCommentCount(data),
    viewCount: extractViewCount(data),
    reactCount: extractReactCount(data),
    voteCount: extractVoteCount(data),
    checklistProgress: extractChecklistProgress(data),
    createdBy: extractCreatedBy(data),
    createdOn: extractDateCreated(data as LinkTypeCreated),
    dueOn: extractDueOn(data),
    previewAction: extractPreviewAction(response),
    viewAction: extractViewAction(data),
    downloadAction: extractDownloadAction(data),
    latestCommit: extractLatestCommit(data as JsonLd.Data.SourceCodeRepository),
    linkIcon: extractLinkIcon(response, renderers),
    modifiedBy: extractModifiedBy(data),
    modifiedOn: extractDateUpdated(data),
    preview: extractPreview(data),
    priority: extractPriority(data as JsonLd.Data.Task),
    provider: extractProviderIcon(data),
    programmingLanguage: extractProgrammingLanguage(data),
    snippet: extractSummary(data) || undefined, // Explicitly set here to remove an empty string
    sourceBranch: extractSourceBranch(
      data as JsonLd.Data.SourceCodePullRequest,
    ),
    state: extractLozenge(data),
    subscriberCount: extractSubscriberCount(data),
    targetBranch: extractTargetBranch(
      data as JsonLd.Data.SourceCodePullRequest,
    ),
    title: extractTitle(data) || url,
    url,
  };
};

export default extractFlexibleUiContext;

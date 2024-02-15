import { JsonLd } from 'json-ld-types';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { extractTitleTextColor, extractSummary } from '../common/primitives';
import { extractLozenge } from '../common/lozenge';
import { extractIcon } from '../common/icon';
import {
  extractCommentCount,
  LinkCommentType,
  extractProgrammingLanguage,
  LinkProgrammingLanguageType,
  extractSubscriberCount,
  LinkSubscriberType,
  extractAttachmentCount,
  LinkAttachmentType,
} from '../common/detail';
import { LinkDetail } from '../common/detail/types';
import {
  extractLink,
  extractTitle,
  extractProvider,
  LinkPerson,
  extractMembers,
  extractPersonAssignedTo,
  extractPersonCreatedBy,
  extractPersonUpdatedBy,
  LinkTypeUpdatedBy,
  extractImage,
} from '@atlaskit/link-extractors';
import { extractByline } from '../common/byline/extractByline';
import { extractTitlePrefix } from '../common/title-prefix/extractTitlePrefix';
import { extractClientActions } from '../common/actions/extractActions';
import { ExtractBlockOpts } from './types';
import { extractPreviewAction } from '../common/actions/extractPreviewAction';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { CardPlatform } from '../../view/Card';
import { BlockCardResolvedViewProps } from '../../view/BlockCard';
import { ActionProps } from '../../view/BlockCard/components/Action';

const extractBlockIcon = (
  jsonLd: JsonLd.Data.BaseData,
): BlockCardResolvedViewProps['icon'] => {
  const icon = extractIcon(jsonLd);
  if (typeof icon === 'string') {
    return { url: icon };
  } else {
    return { icon };
  }
};

const extractBlockDetails = (jsonLd: JsonLd.Data.BaseData): LinkDetail[] =>
  [
    extractCommentCount(jsonLd as LinkCommentType),
    extractProgrammingLanguage(jsonLd as LinkProgrammingLanguageType),
    extractSubscriberCount(jsonLd as LinkSubscriberType),
    extractAttachmentCount(jsonLd as LinkAttachmentType),
  ].filter((detail) => !!detail) as LinkDetail[];

export const extractBlockActions = (
  props: BlockCardResolvedViewProps,
  jsonLd: JsonLd.Data.BaseData,
  opts?: ExtractBlockOpts,
  platform?: CardPlatform,
  meta?: JsonLd.Meta.BaseMeta,
): ActionProps[] => {
  if (opts) {
    const { handleInvoke, actionOptions } = opts;
    const actions = extractClientActions(jsonLd, handleInvoke, actionOptions);
    const previewAction = extractPreviewAction({
      ...opts,
      viewProps: props,
      jsonLd,
      platform,
      meta,
    });

    // The previewAction should always be the last action
    if (previewAction) {
      actions.push(previewAction);
    }

    return actions;
  }

  return [];
};

export const extractBlockUsers = (
  jsonLd: JsonLd.Data.BaseData,
): LinkPerson[] | undefined => {
  if (jsonLd['@type'] === 'atlassian:Project') {
    return extractMembers(jsonLd as JsonLd.Data.Project);
  } else if (jsonLd['@type'] === 'atlassian:Task') {
    const assignedMembers = extractPersonAssignedTo(jsonLd as JsonLd.Data.Task);
    if (assignedMembers) {
      return [assignedMembers];
    }
  } else if (jsonLd['@type'] === 'atlassian:SourceCodePullRequest') {
    return extractPersonCreatedBy(jsonLd as JsonLd.Data.SourceCodePullRequest);
  } else {
    const updatedBy = extractPersonUpdatedBy(jsonLd as LinkTypeUpdatedBy);
    let updatedByMembers;
    if (updatedBy) {
      updatedByMembers = [updatedBy];
    }
    const createdByMembers = extractPersonCreatedBy(jsonLd);
    return updatedByMembers || createdByMembers;
  }
};

export const extractBlockProps = (
  jsonLd: JsonLd.Data.BaseData,
  meta?: JsonLd.Meta.BaseMeta,
  opts?: ExtractBlockOpts,
  renderers?: CardProviderRenderers,
  platform?: CardPlatform,
): BlockCardResolvedViewProps => {
  const props = {
    link: extractLink(jsonLd),
    title: extractTitle(jsonLd),
    titleTextColor: extractTitleTextColor(jsonLd),
    lozenge: extractLozenge(jsonLd),
    icon: extractBlockIcon(jsonLd),
    context: extractProvider(jsonLd),
    details: extractBlockDetails(jsonLd),
    byline: extractSummary(jsonLd) || extractByline(jsonLd),
    thumbnail: extractImage(jsonLd),
    users: extractBlockUsers(jsonLd),
    titlePrefix: extractTitlePrefix(jsonLd, renderers, 'block'),
    isTrusted: extractIsTrusted(meta),
  };
  return {
    ...props,
    actions: extractBlockActions(props, jsonLd, opts, platform, meta),
  };
};

import { JsonLd } from 'json-ld-types';
import { BlockCardResolvedViewProps, ActionProps } from '@atlaskit/media-ui';
import {
  extractLink,
  extractTitle,
  extractTitleTextColor,
  extractSummary,
} from '../common/primitives';
import { extractLozenge } from '../common/lozenge';
import { extractIcon } from '../common/icon';
import { extractProvider } from '../common/context/extractProvider';
import {
  extractCommentCount,
  LinkCommentType,
  extractProgrammingLanguage,
  LinkProgrammingLanguageType,
  extractSubscriberCount,
  LinkSubscriberType,
} from '../common/detail';
import { LinkDetail } from '../common/detail/types';
import { LinkPerson } from '../common/person/types';
import { extractMembers } from '../common/person/extractMembers';
import { extractPersonAssignedTo } from '../common/person/extractPersonAssignedTo';
import { extractPersonCreatedBy } from '../common/person/extractPersonCreatedBy';
import {
  extractPersonUpdatedBy,
  LinkTypeUpdatedBy,
} from '../common/person/extractPersonUpdatedBy';
import { extractByline } from '../common/byline/extractByline';
import { extractTitlePrefix } from '../common/title-prefix/extractTitlePrefix';
import { extractImage } from '../common/preview/extractImage';
import { extractActions } from '../common/actions/extractActions';
import { ExtractBlockOpts } from './types';
import { extractPreviewAction } from '../common/actions/extractPreviewAction';
import { CardProviderRenderers } from '../../state/context/types';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { CardPlatform } from '../../view/Card';

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
  ].filter((detail) => !!detail) as LinkDetail[];

export const extractBlockActions = (
  props: BlockCardResolvedViewProps,
  jsonLd: JsonLd.Data.BaseData,
  opts?: ExtractBlockOpts,
  platform?: CardPlatform,
): ActionProps[] => {
  if (opts) {
    const { handleInvoke, handleAnalytics, definitionId, testId } = opts;
    const actions = extractActions(jsonLd, handleInvoke);
    const previewAction = extractPreviewAction(
      definitionId,
      props,
      jsonLd,
      handleInvoke,
      handleAnalytics,
      testId,
      platform,
    );

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
    actions: extractBlockActions(props, jsonLd, opts, platform),
  };
};

import { JsonLd } from 'json-ld-types';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import {
  extractLink,
  extractTitle,
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
import { extractByline } from '../common/byline/extractByline';
import { extractImage } from '../common/preview/extractImage';

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
  ].filter(detail => !!detail) as LinkDetail[];

export const extractBlockProps = (
  jsonLd: JsonLd.Data.BaseData,
): BlockCardResolvedViewProps => ({
  link: extractLink(jsonLd),
  title: extractTitle(jsonLd),
  lozenge: extractLozenge(jsonLd),
  icon: extractBlockIcon(jsonLd),
  context: extractProvider(jsonLd),
  details: extractBlockDetails(jsonLd),
  byline: extractSummary(jsonLd) || extractByline(jsonLd),
  thumbnail: extractImage(jsonLd),
  // TODO, EDM-564: re-enable after sparring with Magda, currently
  // renders nothing - no good data sources for
  users: [], // extractBlockUsers(jsonLd);
});

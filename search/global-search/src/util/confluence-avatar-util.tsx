import React from 'react';
import { ConfluenceObjectResult, ContentType } from '../model/Result';
import PageIcon from '@atlaskit/icon-object/glyph/page/24';
import BlogIcon from '@atlaskit/icon-object/glyph/blog/24';
import ImageIcon from '@atlaskit/icon-file-type/glyph/image/24';
import ExcelSpreadsheetIcon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24';
import VideoIcon from '@atlaskit/icon-file-type/glyph/video/24';
import ArchiveIcon from '@atlaskit/icon-file-type/glyph/archive/24';
import PowerpointPresentationIcon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24';
import SourceCodeIcon from '@atlaskit/icon-file-type/glyph/source-code/24';
import AudioIcon from '@atlaskit/icon-file-type/glyph/audio/24';
import WordDocumentIcon from '@atlaskit/icon-file-type/glyph/word-document/24';
import PdfDocumentIcon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import GenericIcon from '@atlaskit/icon-file-type/glyph/generic/24';

import Avatar from '@atlaskit/avatar';
import { colors } from '@atlaskit/theme';

export interface ExtensionMatcher {
  regexp: RegExp;
  avatar: any; // can't seem to find a type that doesn't complain here.
}

/**
 * The following code was derived from an implementation in confluence-frontend,
 * although it differs substantially.
 *
 * The original can be found at ./packages/confluence-rest-api/src/helpers/icons.js
 */
const ATTACHMENT_ICON_CLASS_PREFIXES = [
  // Quick Nav prefix
  'content-type-attachment-',
  // CQL prefix
  'icon-file-',
];

const DEFAULT_ATTACHMENT_AVATAR = GenericIcon;
const ATTACHMENT_FILE_EXTENSION_MATCHERS: ExtensionMatcher[] = [
  {
    regexp: /\.(gif|jpeg|jpg|png)$/i,
    avatar: ImageIcon,
  },
  {
    regexp: /\.(pdf)$/i,
    avatar: PdfDocumentIcon,
  },
  {
    regexp: /\.(docx|dotx|doc|dot)$/i,
    avatar: WordDocumentIcon,
  },
  {
    regexp: /\.(xml|html|js|css|java|jar|war|ear)$/i,
    avatar: SourceCodeIcon,
  },
  {
    regexp: /\.(xlt|xls|xlsm|xlsx|xlst)$/i,
    avatar: ExcelSpreadsheetIcon,
  },
  {
    regexp: /\.(wma|wmv|ram|mp3)$/i,
    avatar: AudioIcon,
  },
  {
    regexp: /\.(pptx|ppsx|potx|pot|ppt|pptm)$/i,
    avatar: PowerpointPresentationIcon,
  },
  {
    regexp: /\.(mov|mpeg|mpg|mp4|avi)$/i,
    avatar: VideoIcon,
  },
  {
    regexp: /\.(zip)$/i,
    avatar: ArchiveIcon,
  },
];

const getIconType = (iconClass: string, fileName: string) => {
  // Check the iconClass to make sure we're looking at an attachment
  const prefixMatches = ATTACHMENT_ICON_CLASS_PREFIXES.find(prefix => {
    return iconClass.startsWith(prefix);
  });

  // if it's an attachment, look at the file extension to work out which type
  if (prefixMatches) {
    const matchingType:
      | ExtensionMatcher
      | undefined = ATTACHMENT_FILE_EXTENSION_MATCHERS.find(
      (extensionMatcher: ExtensionMatcher) => {
        const matches = extensionMatcher.regexp.exec(fileName);
        return !!matches && matches.length > 0;
      },
    );

    if (matchingType) {
      return matchingType.avatar;
    }
  }

  return DEFAULT_ATTACHMENT_AVATAR;
};

export const getAvatarForConfluenceObjectResult = (
  result: ConfluenceObjectResult,
) => {
  if (result.contentType === ContentType.ConfluencePage) {
    return (
      <PageIcon size="medium" primaryColor={colors.B200} label={result.name} />
    );
  } else if (result.contentType === ContentType.ConfluenceBlogpost) {
    return (
      <BlogIcon label={result.name} size="medium" primaryColor={colors.B200} />
    );
  } else if (result.contentType === ContentType.ConfluenceAttachment) {
    return getMediaTypeAvatarForResult(result);
  } else {
    return <Avatar src={result.avatarUrl} size="medium" appearance="square" />;
  }
};

export const getMediaTypeAvatarForResult = (result: ConfluenceObjectResult) => {
  const IconComponent = getIconType(result.iconClass!, result.name);

  return <IconComponent label={result.name} size="medium" />;
};

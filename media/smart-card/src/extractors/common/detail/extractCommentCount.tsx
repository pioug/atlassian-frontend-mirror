import React from 'react';
import { N600 } from '@atlaskit/theme/colors';
import ChatIcon from '@atlaskit/icon/glyph/comment';

import { JsonLd } from 'json-ld-types';
import { LinkDetail } from './types';

export type LinkCommentType =
  | JsonLd.Data.Document
  | JsonLd.Data.Page
  | JsonLd.Data.Project
  | JsonLd.Data.SourceCodeCommit
  | JsonLd.Data.TaskType;

export const extractCommentCount = (
  jsonLd: LinkCommentType,
): LinkDetail | undefined => {
  const commentCount = jsonLd['schema:commentCount'];
  if (commentCount) {
    return {
      text: commentCount.toString(),
      icon: (
        <ChatIcon
          label="comment-count"
          key="comments-count-icon"
          size="small"
          primaryColor={N600}
        />
      ),
    };
  }
};

import React from 'react';
import { N600 } from '@atlaskit/theme/colors';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import { token } from '@atlaskit/tokens';

import { JsonLd } from 'json-ld-types';
import { LinkDetail } from './types';

export type LinkAttachmentType =
  | JsonLd.Data.Document
  | JsonLd.Data.Task
  | JsonLd.Data.TaskType
  | JsonLd.Data.Project;

export const extractAttachmentCount = (
  jsonLd: LinkAttachmentType,
): LinkDetail | undefined => {
  const attachmentCount = jsonLd['atlassian:attachmentCount'];
  if (attachmentCount) {
    return {
      text: attachmentCount.toString(),
      icon: (
        <AttachmentIcon
          size="small"
          label="attachments"
          primaryColor={token('color.icon.subtle', N600)}
        />
      ),
    };
  }
};

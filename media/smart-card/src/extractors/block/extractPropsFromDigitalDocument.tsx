import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/16';

import { extractPropsFromDocument } from './extractPropsFromDocument';
import { getIconForFileType } from '../../utils';

export const buildIcon = (json: any) => {
  const fileFormat = json.fileFormat || json['schema:fileFormat'];
  if (fileFormat) {
    const icon = getIconForFileType(fileFormat);
    if (icon) {
      return { icon: { icon } };
    } else {
      return { icon: { icon: <FileIcon label={json.name} /> } };
    }
  }
  return { icon: { icon: <FileIcon label={json.name} /> } };
};

export const extractPropsFromDigitalDocument = (
  json: any,
): BlockCardResolvedViewProps => {
  const props = extractPropsFromDocument(json);
  return {
    ...props,
    ...buildIcon(json),
  };
};

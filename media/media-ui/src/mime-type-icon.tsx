import React from 'react';
import { MediaType } from '@atlaskit/media-common';
import { getMimeIcon } from './util';
import { MediaTypeIcon } from './media-type-icon';
import { IconWrapper } from './media-type-icon';

type MediaTypeProps = {
  mediaType?: MediaType;
  mimeType?: string;
  name?: string;
};

/*
 * Renders an icon. First, check if the mimeType corresponds to any of the special mimeType icons (.gif, .sketch, .exe, ect). If so, render that icon.
 * Else, render an icon corresponding to its mediaType (doc/audio/image/video/unknown)
 */
export const MimeTypeIcon = ({
  mediaType = 'unknown',
  mimeType = 'unknown',
  name = 'unknown',
}: MediaTypeProps) => {
  // retrieve mimetype icon and label
  const iconInfo = getMimeIcon(mimeType, name);

  // a corresponding mimetype icon and label was found.
  if (iconInfo) {
    const Icon = iconInfo.icon;
    return (
      <IconWrapper data-testid="media-viewer-file-type-icon" type={mediaType}>
        <Icon label={iconInfo.label} size="large" />
      </IconWrapper>
    );
  }

  // no correponding mimetype icon/label was found.
  // Hence, return a mediatype (image/doc/audio/video/unknown) icon
  return <MediaTypeIcon type={mediaType} />;
};

import React from 'react';
import mediaImageWidthBiggerThanColumnWidth from '../__fixtures__/media-image-width-bigger-than-column-width.adf.json';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaBiggerThanColumnWidth = () => {
  return <MediaBaseRenderer adf={mediaImageWidthBiggerThanColumnWidth} />;
};

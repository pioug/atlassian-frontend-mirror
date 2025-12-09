import React from 'react';
import mediaImageWidthBiggerThanColumnWidth from '../__fixtures__/media-image-width-bigger-than-column-width.adf.json';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaBiggerThanColumnWidth = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={mediaImageWidthBiggerThanColumnWidth} />;
};

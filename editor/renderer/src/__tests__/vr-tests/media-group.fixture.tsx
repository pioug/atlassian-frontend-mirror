import React from 'react';

import { mediaGroupAdf } from '../__fixtures__/renderer-mediaGroup.adf';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaGroup = () => {
	return <MediaBaseRenderer adf={mediaGroupAdf} />;
};

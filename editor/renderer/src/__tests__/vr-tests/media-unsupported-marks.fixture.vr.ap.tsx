import React from 'react';

import mediaWithUnsupportedMarksAndAttributes from '../__fixtures__/media-with-unsupported-marks-and-node-attributes.json';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaWithUnsupportedMarks = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={mediaWithUnsupportedMarksAndAttributes} />;
};

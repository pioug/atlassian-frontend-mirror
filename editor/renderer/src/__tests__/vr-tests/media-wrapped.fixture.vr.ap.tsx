import React from 'react';

import wrappedMediaSmallAdf from '../__fixtures__/wrapped-media-small.adf.json';
import wrappedMediaTextSplitAdf from '../__fixtures__/wrapped-media-text-split.adf.json';
import wrappedMediaTextAdf from '../__fixtures__/wrapped-media-text.adf.json';
import wrappedMediaAdf from '../__fixtures__/wrapped-media.adf.json';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaWrapped = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaAdf} />;
};

export const MediaWrappedText = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaTextAdf} />;
};

export const MediaWrappedTextSplit = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaTextSplitAdf} />;
};

export const MediaWrappedSmall = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaSmallAdf} />;
};

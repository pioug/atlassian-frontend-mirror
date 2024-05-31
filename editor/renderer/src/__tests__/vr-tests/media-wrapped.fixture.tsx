import React from 'react';

import wrappedMediaSmallAdf from '../__fixtures__/wrapped-media-small.adf.json';
import wrappedMediaTextSplitAdf from '../__fixtures__/wrapped-media-text-split.adf.json';
import wrappedMediaTextAdf from '../__fixtures__/wrapped-media-text.adf.json';
import wrappedMediaAdf from '../__fixtures__/wrapped-media.adf.json';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaWrapped = () => {
	return <MediaBaseRenderer adf={wrappedMediaAdf} />;
};

export const MediaWrappedText = () => {
	return <MediaBaseRenderer adf={wrappedMediaTextAdf} />;
};

export const MediaWrappedTextSplit = () => {
	return <MediaBaseRenderer adf={wrappedMediaTextSplitAdf} />;
};

export const MediaWrappedSmall = () => {
	return <MediaBaseRenderer adf={wrappedMediaSmallAdf} />;
};

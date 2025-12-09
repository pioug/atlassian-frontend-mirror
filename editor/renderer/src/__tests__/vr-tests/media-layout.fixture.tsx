import React from 'react';

import { MediaBaseRenderer } from '../__helpers/mediaRenderer';
import wrappedMediaTextLayoutSplitAdf from '../__fixtures__/wrapped-media-text-layout-split.adf.json';
import wrappedMediaTextLayoutAdf from '../__fixtures__/wrapped-media-text-layout.adf.json';
import { mediaResizeLayout } from '../__fixtures__/media-resize-layout.adf';
import complexMediaLayout from '../__fixtures__/renderer-media.adf.json';
import wrappedMediaTextLeftAdf from '../__fixtures__/wrapped-media-text-left.adf.json';
import multipleWrappedMediaInLayout from '../__fixtures__/multiple-wrapped-media-in-layout.adf.json';

export const MediaWrappedLayoutSplit = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaTextLayoutSplitAdf} />;
};

export const MediaWrappedLayout = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedMediaTextLayoutAdf} />;
};

export const MediaWrappedComplexLayout = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={mediaResizeLayout} />;
};

export const MediaWrappedComplexResizeLayout = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={complexMediaLayout} />;
};

// For: ED-14454 - tests a regression where content moved beside the renderer for
// wrapped media.
export const MediaWrappedLayoutShiftUp = (): React.JSX.Element => {
	return (
		<div id="renderer-container">
			<MediaBaseRenderer adf={wrappedMediaTextLeftAdf} />
			<div>some element outside renderer</div>
		</div>
	);
};

export const MultipleWrappedMediaInLayout = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={multipleWrappedMediaInLayout} />;
};

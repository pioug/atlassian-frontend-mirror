import React from 'react';

import { MediaBaseRenderer } from '../__helpers/mediaRenderer';
import wrappedMediaTextLayoutSplitAdf from '../__fixtures__/wrapped-media-text-layout-split.adf.json';
import wrappedMediaTextLayoutAdf from '../__fixtures__/wrapped-media-text-layout.adf.json';
import { mediaResizeLayout } from '../__fixtures__/media-resize-layout.adf';
import complexMediaLayout from '../__fixtures__/renderer-media.adf.json';
import wrappedMediaTextLeftAdf from '../__fixtures__/wrapped-media-text-left.adf.json';

export const MediaWrappedLayoutSplit = () => {
  return <MediaBaseRenderer adf={wrappedMediaTextLayoutSplitAdf} />;
};

export const MediaWrappedLayout = () => {
  return <MediaBaseRenderer adf={wrappedMediaTextLayoutAdf} />;
};

export const MediaWrappedComplexLayout = () => {
  return <MediaBaseRenderer adf={mediaResizeLayout} />;
};

export const MediaWrappedComplexResizeLayout = () => {
  return <MediaBaseRenderer adf={complexMediaLayout} />;
};

// For: ED-14454 - tests a regression where content moved beside the renderer for
// wrapped media.
export const MediaWrappedLayoutShiftUp = () => {
  return (
    <div id="renderer-container">
      <MediaBaseRenderer adf={wrappedMediaTextLeftAdf} />
      <div>some element outside renderer</div>
    </div>
  );
};

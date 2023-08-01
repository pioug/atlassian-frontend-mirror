import memoizeOne from 'memoize-one';

import { breakoutWideScaleRatio } from '@atlaskit/editor-shared-styles';

import type { GuidelineConfig } from './types';
import { getContainerWidthOrFullEditorWidth } from './utils';

const getDefaultGuidelines = memoizeOne((editorWidth) => {
  return [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((val, index) => ({
    key: `grid_${index}`,
    position: {
      x: (val / 12) * editorWidth,
    },
  })) as GuidelineConfig[];
});

const getWideGuidelines = memoizeOne((editorWidth: number) => {
  const wideSpacing = (editorWidth * breakoutWideScaleRatio) / 2;
  return [
    {
      key: `wide_left`,
      position: {
        x: -wideSpacing,
      },
    } as GuidelineConfig,
    {
      key: `wide_right`,
      position: {
        x: wideSpacing,
      },
    } as GuidelineConfig,
  ];
});

const getFullWidthGuidelines = memoizeOne((containerWidth: number) => {
  const fullWidth = getContainerWidthOrFullEditorWidth(containerWidth);

  return [
    {
      key: `full_width_left`,
      position: {
        x: -fullWidth,
      },
    } as GuidelineConfig,
    {
      key: `full_width_right`,
      position: {
        x: fullWidth,
      },
    } as GuidelineConfig,
  ];
});

export const generateDefaultGuidelines = (
  editorWidth: number,
  containerWidth: number,
  isFullWidthMode: boolean | undefined = false,
) => {
  const innerGrids = getDefaultGuidelines(editorWidth);
  const wideGuidelines = !isFullWidthMode ? getWideGuidelines(editorWidth) : [];
  const fullWidthGuidelines = !isFullWidthMode
    ? getFullWidthGuidelines(containerWidth)
    : [];

  return [...innerGrids, ...wideGuidelines, ...fullWidthGuidelines];
};

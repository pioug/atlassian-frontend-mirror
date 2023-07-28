import { RichMediaLayout } from '@atlaskit/adf-schema';

import { MediaSingleLayout } from '../media-single';

import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from './constants';
import type { GuidelineConfig } from './types';

export type SnapTo = {
  guidelineKey: string;
  width: number;
};

/**
 * Returns keys of guidelines that are closest to the image and withthin the snapGap.
 * If both default and dynamic guidelines present, only returns default guidelines
 */
export const findClosestSnap = (
  mediaSingleWidth: number,
  snapArray: number[],
  snapTo: SnapTo[],
  snapGap: number = 0,
) => {
  const closestGapIndex = snapArray.reduce(
    (prev, curr, index) =>
      Math.abs(curr - mediaSingleWidth) <
      Math.abs(snapArray[prev] - mediaSingleWidth)
        ? index
        : prev,
    0,
  );
  const gap = Math.abs(snapArray[closestGapIndex] - mediaSingleWidth);
  if (gap < snapGap) {
    const snappingWidth = Math.round(snapTo[closestGapIndex].width);
    let guidelineKeys: string[] = [];
    snapTo.forEach((s) => {
      if (Math.round(Math.abs(s.width)) === snappingWidth) {
        guidelineKeys.push(s.guidelineKey);
      }
    });

    const defaultGuidelineKeys = guidelineKeys.filter(
      (guidelineKey) =>
        !guidelineKey.startsWith(MEDIA_DYNAMIC_GUIDELINE_PREFIX),
    );

    return {
      gap,
      // only highlight default guidelines
      // when there are both default and dynamic guidelines to be highlighted
      keys:
        defaultGuidelineKeys.length &&
        defaultGuidelineKeys.length < guidelineKeys.length
          ? defaultGuidelineKeys
          : guidelineKeys,
    };
  }
  return { gap, keys: [] };
};

/**
 * Get snapping widths and respective guideline keys
 */
export const getSnapWidth = (
  guidelines: GuidelineConfig[],
  mediaSingleWidth: number,
  snap: number,
  layout: RichMediaLayout | null,
) => {
  return guidelines
    .map((guideline) => {
      const positionX =
        guideline.position?.x && typeof guideline.position.x === 'number'
          ? guideline.position.x
          : 0;
      if (
        layout === MediaSingleLayout.CENTER ||
        layout === MediaSingleLayout.WIDE ||
        layout === MediaSingleLayout.FULL_WIDTH
      ) {
        return {
          guidelineKey: guideline.key,
          width: mediaSingleWidth + (snap - positionX) * 2,
        } as SnapTo;
      } else if (
        layout === MediaSingleLayout.ALIGN_END ||
        layout === MediaSingleLayout.WRAP_RIGHT
      ) {
        return {
          guidelineKey: guideline.key,
          width: mediaSingleWidth + (snap - positionX),
        };
      } else if (
        layout === MediaSingleLayout.ALIGN_START ||
        layout === MediaSingleLayout.WRAP_LEFT
      ) {
        return {
          guidelineKey: guideline.key,
          width: mediaSingleWidth + positionX - snap,
        };
      }
      return {
        guidelineKey: '',
        width: 0,
      };
    })
    .filter((guideline) => guideline.guidelineKey !== '');
};

import memoizeOne from 'memoize-one';

import type { RichMediaLayout } from '@atlaskit/adf-schema';

import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from './constants';
import type { GuidelineConfig, GuidelineSnap } from './types';
import { isVerticalPosition } from './utils';

/**
 * Returns keys of guidelines that are closest to the image and withthin the snapGap.
 * If both default and dynamic guidelines present, only returns default guidelines
 */
export const findClosestSnap = (
  mediaSingleWidth: number,
  snapArray: number[],
  guidelineSnaps: GuidelineSnap[],
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
    const snappingWidth = snapArray[closestGapIndex];
    let guidelineKeys: string[] = [];
    // find wich guideline have the matching snap width
    guidelineSnaps.forEach((gs) => {
      if (gs.width === snappingWidth) {
        guidelineKeys.push(gs.guidelineKey);
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

export const getGuidelineSnaps = memoizeOne(
  (
    guidelines: GuidelineConfig[],
    editorWidth: number,
    layout: RichMediaLayout = 'center',
  ) => {
    const offset = editorWidth / 2;
    const getPositionX = (position: GuidelineConfig['position']) => {
      return isVerticalPosition(position) ? position.x : 0;
    };

    const calcXSnaps = (guidelineReference: GuidelineSnap[]) => {
      const snapsWidth = guidelineReference
        .filter((g) => g.width > 0)
        .map((g) => g.width);
      const uniqueSnapWidth = [...new Set(snapsWidth)];
      return snapsWidth.length ? uniqueSnapWidth : undefined;
    };

    const guidelinesSnapsReference = guidelines.map((guideline) => {
      const positionX = getPositionX(guideline.position);
      if (['align-end', 'wrap-right'].includes(layout)) {
        return {
          guidelineKey: guideline.key,
          width: offset - positionX,
        };
      } else if (['align-start', 'wrap-left'].includes(layout)) {
        return {
          guidelineKey: guideline.key,
          width: positionX + offset,
        };
      }
      return {
        guidelineKey: guideline.key,
        width: Math.abs(positionX) * 2,
      };
    });

    return {
      guidelineReference: guidelinesSnapsReference,
      snaps: {
        x: calcXSnaps(guidelinesSnapsReference),
      },
    };
  },
);

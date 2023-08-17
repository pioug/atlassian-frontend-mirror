import {
  type GuidelineConfig,
  isVerticalPosition,
} from '@atlaskit/editor-common/guideline';
import {
  akEditorCalculatedWideLayoutWidth,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';

const numberOfLanesInDefaultLayoutWidth = 12;

const calculateSubSnappingWidths = (totalLanes: number, totalWidth: number) =>
  new Array(Math.round(totalLanes / 2) - 1)
    .fill(totalWidth / totalLanes)
    .map((v, i) => v * (i + 1) * 2);

export const calculateDefaultSnappings = (lengthOffset: number = 0) => [
  ...calculateSubSnappingWidths(
    numberOfLanesInDefaultLayoutWidth,
    akEditorDefaultLayoutWidth + lengthOffset,
  ),
  akEditorDefaultLayoutWidth + lengthOffset,
  akEditorCalculatedWideLayoutWidth + lengthOffset,
  akEditorFullWidthLayoutWidth + lengthOffset,
];

export const defaultSnappingWidths = calculateDefaultSnappings();

/**
 * Returns keys of guidelines that are closest to the table and withthin the snapGap
 */
export const findClosestSnap = (
  currentWidth: number,
  snapWidths: number[],
  guidelines: GuidelineConfig[],
  snapGap: number = 0,
  tolerance: number = 0,
) => {
  const closestGapIndex = snapWidths.reduce(
    (prev, curr, index) =>
      Math.abs(curr - currentWidth) < Math.abs(snapWidths[prev] - currentWidth)
        ? index
        : prev,
    0,
  );
  const gap = Math.abs(snapWidths[closestGapIndex] - currentWidth);
  if (gap < snapGap) {
    const snappingWidth = Math.round(snapWidths[closestGapIndex]);
    const guidelineKeys = guidelines.reduce<string[]>((acc, guideline) => {
      // NOTE: The snap points are based on the guidelines, however their formatted as a length value whereas the guidelines
      // are point based. The point base x coords are calculated by halving the lengths. This means we can convert the
      // point base position to length by simply multiplying by 2.
      const length = Math.round(
        Math.abs(
          isVerticalPosition(guideline.position)
            ? guideline.position.x
            : guideline.position.y,
        ) * 2,
      );
      if (
        snappingWidth >= length - tolerance &&
        snappingWidth <= length + tolerance
      ) {
        acc.push(guideline.key);
      }
      return acc;
    }, []);

    return {
      gap,
      keys: guidelineKeys,
    };
  }
  return { gap, keys: [] };
};

import {
  type GuidelineConfig,
  isVerticalPosition,
} from '@atlaskit/editor-common/guideline';

/**
 * Returns keys of guidelines that are closest to the table and withthin the snapGap
 */
export const findClosestSnap = (
  currentWidth: number,
  snapWidths: number[],
  guidelines: GuidelineConfig[],
  snapGap: number = 0,
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
      if (
        isVerticalPosition(guideline.position) &&
        Math.round(Math.abs(guideline.position.x) * 2) === snappingWidth
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

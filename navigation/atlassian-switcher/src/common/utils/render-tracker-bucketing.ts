const INFINITY = '+Inf';

const RenderTrackerBuckets = ['4000', '2000', '1000', '500'];

export const getRenderBucket = (renderTime: number): string | null => {
  return renderTime >= 0
    ? RenderTrackerBuckets.reduce((lowestBucket, currentBucket) => {
        return renderTime <= parseInt(currentBucket)
          ? currentBucket
          : lowestBucket;
      }, INFINITY)
    : null;
};

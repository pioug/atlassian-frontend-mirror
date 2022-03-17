import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import {
  verifyAnimationTimestamps,
  verifyElementIn,
} from '../../../__tests__/_helper';

const skeletonHeading = '[data-testid="skeleton-heading-item"]';
const skeletonItem = '[data-testid="skeleton-item"]';
const skeletonAvatar = '[data-testid="skeleton-item-avatar"]';
const skeletonIcon = '[data-testid="skeleton-item-icon"]';
const skeletonCustomWidth = '[data-testid="skeleton-item-width"]';

const url = getExampleUrl(
  'design-system',
  'menu',
  'item-variations',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<SkeletonItem />', () => {
  it('should match skeleton heading item', async () => {
    await verifyElementMatchProductionImage(skeletonHeading);
  });

  it('should match skeleton item', async () => {
    await verifyElementMatchProductionImage(skeletonItem);
  });

  it('should match skeleton item with avatar', async () => {
    await verifyElementMatchProductionImage(skeletonAvatar);
  });

  it('should match skeleton item with icon', async () => {
    await verifyElementMatchProductionImage(skeletonIcon);
  });

  it('should match skeleton item with custom width', async () => {
    await verifyElementMatchProductionImage(skeletonCustomWidth);
  });

  /**
   * This test is using an experimental approach to VR testing animations.
   *
   * If it gets caught as flakey,
   * skip it and don't worry about investigating.
   */
  it('should have the correct shimmer when isShimmer={true}', async () => {
    const url = getExampleUrl('design-system', 'menu', 'skeleton-item');
    const selector = '[data-testid="is-shimmering"]';

    const { page } = global;
    await verifyAnimationTimestamps(page, url, selector, [
      0, // keyframe.from
      750,
      1500, // keyframe.to
      2250,
      3000,
    ]);
  });
});

describe('<SkeletonHeadingItem />', () => {
  /**
   * This test is using an experimental approach to VR testing animations.
   *
   * If it gets caught as flakey,
   * skip it and don't worry about investigating.
   */
  it('should have the correct shimmer when isShimmer={true}', async () => {
    const url = getExampleUrl('design-system', 'menu', 'skeleton-heading-item');
    const selector = '[data-testid="is-shimmering"]';

    const { page } = global;
    await verifyAnimationTimestamps(page, url, selector, [
      0, // keyframe.from
      750,
      1500, // keyframe.to
      2250,
      3000,
    ]);
  });
});

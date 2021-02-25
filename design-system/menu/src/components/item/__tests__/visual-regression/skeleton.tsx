import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../../../__tests__/_helper';

const skeketonHeading = '[data-testid="skeleton-heading-item"]';
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
    await verifyElementMatchProductionImage(skeketonHeading);
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
});

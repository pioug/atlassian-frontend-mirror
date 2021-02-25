import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { click, verifyElementIn } from '../_helper';

const toggleButton = "[data-testid='toggle-loading']";
const leftMenu = "[data-testid='left-menu']";

const url = getExampleUrl(
  'design-system',
  'menu',
  'skeleton-items',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

/**
 * The skeleton should match the loaded menu dimensions pixel perfectly.
 * It should not move things around when loading in.
 * If these tests fail - ensure that this behaviour still exists.
 */
describe('<SkeletonMenu />', () => {
  it('should match the loading skeleton menu', async () => {
    await verifyElementMatchProductionImage(leftMenu);
  });

  it('should match the loaded menu', async () => {
    await verifyElementMatchProductionImage(leftMenu, click(toggleButton));
  });
});

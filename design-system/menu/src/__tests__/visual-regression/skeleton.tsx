import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { click, verifyElementIn } from '../_helper';

const toggleButton = "[data-testid='toggle-loading']";
const leftMenu = "[data-testid='left-menu']";

/**
 * The skeleton should match the loaded menu dimensions pixel perfectly.
 * It should not move things around when loading in.
 * If these tests fail - ensure that this behaviour still exists.
 */
describe('<SkeletonMenu />', () => {
  it('should match the loading skeleton menu', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'skeleton-items',
      global.__BASEURL__,
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(leftMenu);
  });

  it('should match the loading skeleton menu when light', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'skeleton-items',
      global.__BASEURL__,
      'light',
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(leftMenu);
  });

  it('should match the loading skeleton menu when dark', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'skeleton-items',
      global.__BASEURL__,
      'dark',
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(leftMenu);
  });

  it('should match the loaded menu', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'skeleton-items',
      global.__BASEURL__,
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(leftMenu, click(toggleButton));
  });
});

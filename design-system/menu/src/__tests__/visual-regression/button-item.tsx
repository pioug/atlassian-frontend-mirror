import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../_helper';

const selector = "[data-testid='button-items']";

describe('<ButtonItem />', () => {
  it('should match the items when stacked', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'button-item',
      global.__BASEURL__,
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(selector);
  });

  it('should match the items when light', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'button-item',
      global.__BASEURL__,
      'light',
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(selector);
  });

  it('should match the items when dark', async () => {
    const url = getExampleUrl(
      'design-system',
      'menu',
      'button-item',
      global.__BASEURL__,
      'dark',
    );

    const expectSnapshotToMatch = verifyElementIn(url);

    await expectSnapshotToMatch(selector);
  });
});

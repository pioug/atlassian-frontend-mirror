import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../_helper';

const selector = "[data-testid='button-items']";

describe('<ButtonItem />', () => {
  it.each(['dark', 'light', 'none'] as const)(
    'should match the items when "%s"',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'menu',
        'button-item',
        global.__BASEURL__,
        theme,
      );

      const expectSnapshotToMatch = verifyElementIn(url);

      await expectSnapshotToMatch(selector);
    },
  );
});

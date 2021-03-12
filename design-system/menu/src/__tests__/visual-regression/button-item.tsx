import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../_helper';

const selector = "[data-testid='button-items']";

const url = getExampleUrl(
  'design-system',
  'menu',
  'button-item',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<ButtonItem />', () => {
  it('should match the items when stacked', async () => {
    await verifyElementMatchProductionImage(selector);
  });
});

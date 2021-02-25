import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../_helper';

const selector = "[data-testid='link-item']";

const url = getExampleUrl(
  'design-system',
  'menu',
  'link-item',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<LinkItem />', () => {
  it('should match production example', async () => {
    await verifyElementMatchProductionImage(selector);
  });
});

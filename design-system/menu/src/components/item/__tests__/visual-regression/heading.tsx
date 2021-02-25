import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { verifyElementIn } from '../../../__tests__/_helper';

const headingItem = '[data-testid="heading-item"]';

const url = getExampleUrl(
  'design-system',
  'menu',
  'item-variations',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<HeadingItem />', () => {
  it('should match selected item', async () => {
    await verifyElementMatchProductionImage(headingItem);
  });
});

import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { hover, mouseDown, verifyElementIn } from '../../../__tests__/_helper';

const linkItem = '[data-testid="item-link"]';

const linkItemSelected = '[data-testid="item-link-selected"]';

const url = getExampleUrl(
  'design-system',
  'menu',
  'item-variations',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url);

describe('<LinkItem />', () => {
  it('should match the default state', async () => {
    await verifyElementMatchProductionImage(linkItem);
  });

  it('should match the hovered state', async () => {
    await verifyElementMatchProductionImage(linkItem, hover(linkItem));
  });

  it('should match the clicked state', async () => {
    await verifyElementMatchProductionImage(linkItem, mouseDown(linkItem));
  });

  it('should match selected item', async () => {
    await verifyElementMatchProductionImage(linkItemSelected);
  });
});

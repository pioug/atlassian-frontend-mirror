import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import {
  focus,
  hover,
  mouseDown,
  verifyElementIn,
} from '../../../__tests__/_helper';

const linkItem = '[data-testid="item-link"]';
const linkItemSelected = '[data-testid="item-link-selected"]';
const linkItemMultipleLine = '[data-testid="item-link-multiple-line"]';
const linkItemLongUrl = '[data-testid="item-link-long-url-multiple-line"]';

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

  it('should match the focused state', async () => {
    await verifyElementMatchProductionImage(linkItem, focus(linkItem));
  });

  it('should match selected item', async () => {
    await verifyElementMatchProductionImage(linkItemSelected);
  });

  it('should match item with lots of text - wrap text', async () => {
    await verifyElementMatchProductionImage(linkItemMultipleLine);
  });

  it('should match item with lots of text - wrap text for long url', async () => {
    await verifyElementMatchProductionImage(linkItemLongUrl);
  });
});

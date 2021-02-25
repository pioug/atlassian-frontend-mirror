import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import { focus, hover, verifyElementIn } from '../../../__tests__/_helper';

const withAdjacentSections = "[data-testid='with-adjacent-sections']";
const mockStarredMenu = "[data-testid='mock-starred-menu']";

const url = getExampleUrl(
  'design-system',
  'menu',
  'menu-group',
  global.__BASEURL__,
);

const verifyElementMatchProductionImage = verifyElementIn(url, {
  viewport: { width: 1920, height: 1080 },
});

describe('<PopupMenuGroup />', () => {
  it('should match the MenuGroup with adjacent sections', async () => {
    await verifyElementMatchProductionImage(withAdjacentSections);
  });

  it('should match the PopupMenuGroup', async () => {
    await verifyElementMatchProductionImage(
      mockStarredMenu,
      hover(mockStarredMenu),
    );
  });

  it('should match the adjacent sections menu when Favourite articles scrolled down', async () => {
    await verifyElementMatchProductionImage(
      withAdjacentSections,
      focus('[aria-label="Favourite articles"] > button:last-child'),
    );
  });
});

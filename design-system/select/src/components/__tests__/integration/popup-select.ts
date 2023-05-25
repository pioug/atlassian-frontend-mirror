import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlPopupSelect = getExampleUrl('design-system', 'select', 'popup-select');
// css-selectors:
const popupButton = '#examples button';
const popupSelect = '#react-select-2-input';

BrowserTestCase(
  `Popup Select should open and close when interacted with`,
  {},
  async (client: any) => {
    const popupSelectTest = new Page(client);
    await popupSelectTest.goto(urlPopupSelect);
    await popupSelectTest.waitForSelector(popupButton);
    expect(await popupSelectTest.isExisting(popupSelect)).toBe(false);

    await popupSelectTest.click(popupButton);
    expect(await popupSelectTest.isVisible(popupSelect)).toBe(true);

    await popupSelectTest.keys(['Escape']);
    expect(await popupSelectTest.isExisting(popupSelect)).toBe(false);

    await popupSelectTest.checkConsoleErrors();
  },
);

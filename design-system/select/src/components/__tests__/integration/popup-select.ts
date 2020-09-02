import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlPopupSelect = getExampleUrl('design-system', 'select', 'popup-select');
// css-selectors:
const popupButton = '#examples button';
const popupSelect = '#react-select-2-input';

BrowserTestCase(
  `Popup Select should close when Escape key is pressed in IE and Edge`,
  { skip: ['safari', 'chrome', 'firefox'] }, // the issue was only occurring in IE and Edge - AK-5319
  async (client: any) => {
    const popupSelectTest = new Page(client);
    await popupSelectTest.goto(urlPopupSelect);
    await popupSelectTest.waitForSelector(popupButton);
    await popupSelectTest.click(popupButton);
    expect(await popupSelectTest.isVisible(popupSelect)).toBe(true);

    await popupSelectTest.keys(['Escape']);
    // in IE11 and Edge, after hitting escape, the element disappears from the DOM and can't be queried.
    try {
      await popupSelectTest.isExisting(popupSelect);
    } catch (err) {
      expect(err.toString()).toContain(
        `Error: Unable to find element with css selector == ${popupSelect}`,
      );
    }
    await popupSelectTest.checkConsoleErrors();
  },
);

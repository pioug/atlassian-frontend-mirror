import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { extensionSelectors } from '../../../__tests__/__helpers/page-objects/_extensions';

export async function goToConfigPanelWithParameters() {
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'config-panel-with-parameters',
  );

  const { page } = global;
  await loadPage(page, url);
  await page.waitForSelector(extensionSelectors.configPanel);

  return page;
}

describe('Snapshot Test', () => {
  it.skip('should display config panels with fields correctly', async () => {
    const page = await goToConfigPanelWithParameters();

    const image = await takeElementScreenShot(
      page,
      extensionSelectors.configPanel,
    );
    expect(image).toMatchProdImageSnapshot();
  });

  it('should display select options with icons correctly', async () => {
    const iconSelectSelector = 'div[id^="enum-select-icon"]';
    const page = await goToConfigPanelWithParameters();

    await page.click(iconSelectSelector);
    const iconSelectDropDownSelector =
      'div[id^="enum-select-icon"] div[class*="MenuList"]';
    const image = await takeElementScreenShot(page, iconSelectDropDownSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it.skip('should position calendar for datefield correctly', async () => {
    const dateInputSelector = 'input[name="date-start"]';
    const page = await goToConfigPanelWithParameters();
    const dateInputElement = await page.$(dateInputSelector);
    await page.evaluateHandle(el => {
      const dateFieldElement = el.nextElementSibling;
      dateFieldElement.click();
    }, dateInputElement);
    const image = await takeElementScreenShot(
      page,
      extensionSelectors.configPanel,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});

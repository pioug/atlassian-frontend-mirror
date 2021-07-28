import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { getBoundingClientRect } from '../_utils';
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
  it('should display config panels with fields correctly', async () => {
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

  it('should position calendar for datefield correctly', async () => {
    const dateInputSelector = 'input[name="date-start"]';
    const page = await goToConfigPanelWithParameters();
    const dateInputElement = await page.$(dateInputSelector);

    // Resize the viewport to screenshot elements outside of the viewport
    const configPanelForm = await page.$(
      'form[data-testid="extension-config-panel"]',
    );
    const bodyBox = await configPanelForm!.boundingBox();
    const newViewport = {
      width: Math.ceil(bodyBox!.width) + Math.ceil(bodyBox!.x),
      height: Math.ceil(bodyBox!.height) + Math.ceil(bodyBox!.y),
    };
    await page.setViewport(newViewport);

    await page.evaluateHandle((el) => {
      const dateFieldElement = el.nextElementSibling;
      dateFieldElement.click();
    }, dateInputElement);

    // Clip the screenshot to just the date picker
    const { top: y, left: x, width } = await getBoundingClientRect(
      page,
      `${extensionSelectors.configPanel} .field-wrapper-date`,
    );
    const image = await page.screenshot({
      clip: { x, y, width, height: 380 },
    });
    expect(image).toMatchProdImageSnapshot();
  });
});

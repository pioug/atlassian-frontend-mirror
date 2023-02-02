import { BrowserTestCase } from '@atlaskit/webdriver-runner/lib/runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';

const moreFormatting = '[aria-label="More formatting"]';
const underlineOption = '[aria-label*="Underline"]';
const dropdownMenu = '[data-role="droplistContent"]';

BrowserTestCase(
  'text formatting: menu should close when more options is chosen by mouse',
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, { appearance: fullpage.appearance });

    await page.click(moreFormatting);
    await page.click(underlineOption);
    await expect(page.waitForInvisible(underlineOption)).resolves.toBe(true);
  },
);

BrowserTestCase(
  'text formatting: menu should remain open when more options is chosen by keyboard',
  {},
  async (client: BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: fullpage.appearance });

    await page.click(moreFormatting);
    await page.waitForSelector(dropdownMenu);
    await page.keys(['ArrowDown', 'Enter']);
    await expect(page.waitForVisible(dropdownMenu)).resolves.toBe(true);
  },
);

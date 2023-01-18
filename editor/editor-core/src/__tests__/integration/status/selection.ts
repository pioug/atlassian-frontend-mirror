import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { getBoundingRect } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { STATUS_SELECTORS } from '@atlaskit/editor-test-helpers/page-objects/status';
import {
  fullpage,
  expectToMatchSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import statusAdf from './__fixtures__/status-single.adf.json';
import statusWithTextAdf from './__fixtures__/status-with-text.adf.json';

BrowserTestCase(
  'selection.ts: Clicking after a status produces a text selection to its right',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowStatus: true,
      defaultValue: statusAdf,
    });
    await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);
    const positionAfterStatus = 2;
    const slightOffset = 10;

    // click after the status
    const bounds = await getBoundingRect(page, STATUS_SELECTORS.STATUS_NODE);
    const x = Math.ceil(bounds.width) + slightOffset;
    await page.moveTo(STATUS_SELECTORS.STATUS_NODE, x, slightOffset);
    await page.click();

    await expectToMatchSelection(page, {
      anchor: positionAfterStatus,
      head: positionAfterStatus,
      type: 'text',
    });
  },
);

BrowserTestCase(
  'selection.ts: selecting line with a status and text via keys',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowStatus: true,
      defaultValue: statusWithTextAdf,
    });
    await page.waitForSelector(STATUS_SELECTORS.STATUS_NODE);

    // click in the text after the status and move cursor to the end of the line
    const textAfterStatusSelector = `//p[contains(text(), "text after status")]`;
    await page.click(textAfterStatusSelector);
    await page.keys(['End'], true);
    await expectToMatchSelection(page, {
      anchor: 19,
      head: 19,
      type: 'text',
    });

    // select the whole line with keys
    await page.keys(['Shift', 'Home'], true);
    await expectToMatchSelection(page, {
      anchor: 19,
      head: 1,
      type: 'text',
    });
  },
);

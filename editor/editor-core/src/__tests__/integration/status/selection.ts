import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getBoundingRect,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { STATUS_SELECTORS } from '@atlaskit/editor-test-helpers/page-objects/status';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
    // ED-16860: force a click prior to resolve issue where Windows/Firefox
    // does not move selection after the later test click.
    if (page.isBrowser('firefox') && page.isWindowsPlatform()) {
      await page.click(selectors.editor);
    }
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

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import { STATUS_SELECTORS } from '../../__helpers/page-objects/_status';
import { fullpage, expectToMatchSelection } from '../_helpers';
import statusAdf from './__fixtures__/status-single.adf.json';

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

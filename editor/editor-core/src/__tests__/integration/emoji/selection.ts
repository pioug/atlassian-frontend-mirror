import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { fullpage, expectToMatchSelection } from '../_helpers';
import emojiAdf from './__fixtures__/emoji-single.adf.json';

BrowserTestCase(
  'selection.ts: Clicking after an emoji produces a text selection to its right',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowStatus: true,
      defaultValue: emojiAdf,
    });
    await page.waitForSelector(emojiSelectors.standard);
    const positionAfterEmoji = 2;
    const slightOffset = 15;

    // Click after the emoji
    const bounds = await getBoundingRect(page, emojiSelectors.standard);
    const x = Math.ceil(bounds.width) + slightOffset;
    await page.moveTo(emojiSelectors.standard, x, slightOffset);
    await page.click();

    await expectToMatchSelection(page, {
      anchor: positionAfterEmoji,
      head: positionAfterEmoji,
      type: 'text',
    });
  },
);

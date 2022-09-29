import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { getBoundingRect } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  fullpage,
  expectToMatchSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
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

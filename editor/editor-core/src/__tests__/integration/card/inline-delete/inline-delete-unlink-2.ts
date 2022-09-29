import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

BrowserTestCase(
  `card: unlinking a card created from CMD + K should leave only url text`,
  {},
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.keys(['ArrowDown', 'Return']);

    await waitForInlineCardSelection(page);
    await page.click('button[aria-label="Unlink"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    `card: unlinking a card created from CMD + K should leave only url text`,
    {},
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          smartLinks: {
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);

      await page.type(linkPickerSelectors.linkInput, 'home opt-in');
      await page.keys(['ArrowDown', 'Return']);

      await waitForInlineCardSelection(page);
      await page.click('button[aria-label="Unlink"]');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});

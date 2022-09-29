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
  linkLabelSelector,
  insertLongText,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

BrowserTestCase(
  'card: inserting a link with CMD + K with link not in recents list inserted as blue link',
  {},
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);
    const mockUrl = 'https://i.want.donuts';

    // Go to the editor example.
    await gotoEditor(page);

    // Open up the link toolbar from the Editor toolbar (top).
    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);
    await page.waitForSelector(linkLabelSelector);

    // Type an arbitrary link we want to insert.
    await page.type(linkUrlSelector, mockUrl);
    await page.keys(['Return']);
    // Ensure a link has been inserted.
    await page.waitForSelector(`a[href="${mockUrl}"]`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    'card: inserting a link with CMD + K with link not in recents list inserted as blue link',
    {},
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      // Go to the editor example.
      const mockUrl = 'https://i.want.donuts';
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
          providers: {
            cards: true,
          },
          withLinkPickerOptions: true,
        },
      );

      // Open up the link toolbar from the Editor toolbar (top).
      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);

      // Type an arbitrary link we want to insert.
      await page.type(linkPickerSelectors.linkInput, mockUrl);
      await page.keys(['Return']);
      // Ensure a link has been inserted.
      await page.waitForSelector(`a[href="${mockUrl}"]`);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});

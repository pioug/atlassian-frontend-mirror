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
  linkRecentList,
  insertLongText,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

const mockLinkSearchTitle = 'home opt-in';
const mockLinkUrlEndsWith = 'Home+opt-in+requests';

BrowserTestCase(
  'card: inserting a link with CMD + K with click should retain display text and insert a blue link',
  {
    skip: ['safari'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Go to the editor example.
    await gotoEditor(page);

    // Open up the link toolbar from the Editor toolbar (top).
    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);
    await page.waitForSelector(linkLabelSelector);

    // Find the link we want to insert.
    await page.type(linkUrlSelector, [mockLinkSearchTitle, 'Tab']);
    // Give the link display text.
    await page.type(linkLabelSelector, ['Go hard or go home']);
    // Click on the first result (should only be one).
    await page.click(`${linkRecentList} ul li:first-child`);

    // Ensure a link has been inserted.
    await page.waitForSelector(`a[href$="${mockLinkUrlEndsWith}"]`);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    'card: inserting a link with CMD + K with click should retain display text and insert a blue link',
    {
      skip: ['safari'],
    },
    async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          smartLinks: {},
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );
      // Open up the link toolbar from the Editor toolbar (top).
      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await page.waitForSelector(linkPickerSelectors.linkDisplayTextInput);

      // Find the link we want to insert.
      await page.type(linkPickerSelectors.linkInput, [
        mockLinkSearchTitle,
        'Tab',
      ]);
      // Give the link display text.
      await page.type(linkPickerSelectors.linkDisplayTextInput, [
        'Go hard or go home',
      ]);
      // Click on the first result (should only be one).
      await page.click(`${linkPickerSelectors.listItem}:first-child`);

      // Ensure a link has been inserted.
      await page.waitForSelector(`a[href$="${mockLinkUrlEndsWith}"]`);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});

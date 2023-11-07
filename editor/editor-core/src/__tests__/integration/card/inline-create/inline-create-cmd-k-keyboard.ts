// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  fullpage,
  getDocFromElement,
  insertLongText,
  linkUrlSelector,
  quickInsert,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { isFocusTrapped } from '../_utils';

BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card using keyboard`,
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
      },
      {
        providers: {
          cards: true,
        },
      },
    );

    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, 'home opt-in');
    await page.keys(['ArrowDown', 'Return']);
    await page.waitForSelector('.inlineCardView-content-wrap');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    `card: selecting a link from CMD + K menu should create an inline card using keyboard`,
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
          providers: {
            cards: true,
          },
          withLinkPickerOptions: true,
        },
      );
      await insertLongText(page);
      await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
      await page.waitForSelector(linkPickerSelectors.linkInput);

      await page.type(linkPickerSelectors.linkInput, 'home opt-in');
      await page.keys(['ArrowDown', 'Return']);
      await page.waitForSelector('.inlineCardView-content-wrap');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  describe.each([true, false])(
    'when ff lp-link-picker-focus-trap is %p',
    (featureFlag: boolean) => {
      BrowserTestCase(
        `inserting a smart card, focus ${
          featureFlag ? 'IS' : 'IS NOT'
        } trapped within the link picker`,
        {
          // Skip safari as per https://hello.atlassian.net/wiki/spaces/AF/pages/971139617/Browserstack+known+issues
          skip: ['safari'],
        },
        async (client: any) => {
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
                'lp-link-picker-focus-trap': featureFlag,
              },
            },
            {
              providers: {
                cards: true,
              },
              withLinkPickerOptions: true,
            },
          );

          await quickInsert(page, 'Link');
          await page.waitForSelector(linkPickerSelectors.linkInput);

          const linkInput = await page.$(linkPickerSelectors.linkInput);

          expect(
            await isFocusTrapped(
              page,
              linkInput,
              linkPickerSelectors.linkPicker,
            ),
          ).toBe(featureFlag);
        },
      );
    },
  );
});

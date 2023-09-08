import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  hyperlinkSelectors,
  linkPickerSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import basicHyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';

import { isFocusTrapped } from './_utils';

describe('with feature flag: lp-link-picker', () => {
  /**
   * NOTE: This behaviour can change if all floating toolbars are expected to trap focus
   */
  BrowserTestCase(
    'with ff lp-link-picker-focus-trap: does not trap focus within the floating toolbar',
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
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
            'lp-link-picker-focus-trap': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await page.waitForSelector(hyperlinkSelectors.hyperlink);
      await page.click(hyperlinkSelectors.hyperlink);
      const editor = await page.$(selectors.editor);

      // Editor (hyperlink) should be in focus
      expect(await editor.isFocused()).toBe(true);

      // Shift tab should bring us to last item in toolbar
      await page.keys(['Shift', 'Tab', 'Shift'], true);

      await page.waitForSelector(hyperlinkSelectors.copyBtn);
      const copyButton = await page.$(hyperlinkSelectors.copyBtn);
      expect(await editor.isFocused()).toBe(false);
      expect(await copyButton.isFocused()).toBe(true);

      await page.pause(100);

      // Pressing tab returns focus to editor (not trapped)
      await page.keys(['Tab']);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  describe.each([true, false])(
    'when ff lp-link-picker-focus-trap is %p',
    (featureFlag: boolean) => {
      // FIXME: This test was automatically skipped due to failure on 26/07/2023: https://product-fabric.atlassian.net/browse/ED-19224
      BrowserTestCase(
        `ff lp-link-picker-focus-trap is ${featureFlag}: when editing a link mark, focus ${
          featureFlag ? 'IS' : 'IS NOT'
        } trapped within the link picker`,
        {
          skip: ['*'],
        },
        async (client: any) => {
          const page = await goToEditorTestingWDExample(client);
          await mountEditor(
            page,
            {
              appearance: fullpage.appearance,
              defaultValue: basicHyperlinkAdf,
              featureFlags: {
                'lp-link-picker': true,
                'lp-link-picker-focus-trap': featureFlag,
              },
            },
            {
              withLinkPickerOptions: true,
            },
          );

          await page.waitForSelector(hyperlinkSelectors.hyperlink);
          await page.click(hyperlinkSelectors.hyperlink);
          await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
          await page.click(hyperlinkSelectors.editLinkBtn);

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

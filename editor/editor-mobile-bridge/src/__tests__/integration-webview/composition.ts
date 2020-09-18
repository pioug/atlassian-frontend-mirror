import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { loadEditor, getADFContent } from './_utils/afe-app-helpers';

MobileTestCase(
  'Composition: Predictive IME Text replacement on Software Keyboard',
  {},
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);

    let inputText: string;
    if (page.isIOS()) {
      /**
       * On iOS we use a 'text replacement' phrase, because triggering 'auto complete'
       * is inconsistent between runs.
       *
       * @see https://support.apple.com/en-us/HT207525
       */
      inputText = 'omw';
    } else {
      /**
       * On Android we test 'auto complete' on the Gboard keyboard, and a regular word
       * for Samsung keyboards (since auto complete isn't triggering automatically).
       */
      // inputText = page.manufacturer() === 'SAMSUNG' ? 'Cat' : 'Wasn';
      inputText = 'Cat';
    }

    /**
     * Tap each individual letter on the software keyboard to trigger composition events.
     *
     * Alphanumeric input sends composition start & update events, and the space key sends
     * the composition end event.
     */
    await page.tapKeys(inputText);
    await page.tapKeys(SPECIAL_KEYS.SPACE);

    const adfContent = await getADFContent(page);
    expect(adfContent).toMatchCustomDocSnapshot(
      `${testName} - ${page.platform()} - ${page.manufacturer()}.`,
    );
  },
);

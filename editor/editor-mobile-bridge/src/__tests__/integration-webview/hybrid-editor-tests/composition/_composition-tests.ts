import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/lib/appium/keyboard/common-osk';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { getADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';

export default async () => {
  /**
   * As a Rich Text Editor, one of the biggest differences between
   * text input on desktop and handheld devices is that text insertion
   * dispatches Keyboard Events for external hardware keyboards
   * (e.g. those use on a laptop or desktop computer), and Composition
   * Events for software keyboards.
   *
   * This input distinction is handled internally within ProseMirror
   * where different code paths are taken before ultimately updating
   * the DOM with the expected content.
   *
   * Prior to running tests on real mobiles we were blind to the impact
   * of changes we made to the editor codebase and how they may affect
   * mobile users.
   *
   * Note that compositional input is also used on desktop for certain
   * non-english keyboards with extended character sets (e.g. Japanese 'Katakana')
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide
   *
   * These tests use `page.tapKeys` which taps each individual letter on
   * the software keyboard to trigger composition events.
   *
   * Alphanumeric input sends composition start & update events, and the
   * space key sends the composition end event to commit the inut value.
   */

  /**
   * This is testing generic compositional input cross platform.
   */
  MobileTestCase(
    'Composition: Typing via the Software Keyboard',
    {
      versions: ['DEFAULT', 'android 11'],
      keyboards: ['apple', 'gboard'],
    },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await page.tapKeys('Hello World');
      await page.tapKeys(SPECIAL_KEYS.SPACE);

      const adfContent = await getADFContent(page);
      expect(adfContent).toMatchCustomDocSnapshot(testName);
    },
  );

  /**
   * This is testing the 'text replacement' feature of iOS.
   *
   * The feature exists on Android too, but Android doesn't ship
   * any default phrases so it's outside the scope of our test
   * to provide a user generated phrase in Android settings.
   *
   * @see https://support.apple.com/en-us/HT207525
   */
  MobileTestCase(
    'Composition: Text Replacement on Software Keyboard (iOS)',
    { skipPlatform: ['android'] },
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);

      // This is a special text replacement phrase that is provided as an example of
      // the feature on iOS, so it's guaranteed to exist.
      // It's a shortcut for 'On my way!'
      await page.tapKeys('omw');
      await page.tapKeys(SPECIAL_KEYS.SPACE);

      const adfContent = await getADFContent(page);
      expect(adfContent).toMatchCustomDocSnapshot(testName);
    },
  );

  /**
   * This test is testing 'auto complete' or 'predictive text' where
   * spelling mistakes are automatically corrected as the user types.
   *
   * Android and iOS have different algorthms for auto correction
   * and it even changes over time based on learned behaviour from
   * the usr.
   */
  MobileTestCase(
    'Composition: Auto Completion on Software Keyboard',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);

      // Predictive keyboards are disabled by default in BrowserStack
      // So we explicitly enable it.
      await page.enablePredictiveKeyboard();

      // Auto complete to add missing apostrophe
      await page.tapKeys('Cant');
      await page.tapKeys(SPECIAL_KEYS.SPACE);

      const adfContent = await getADFContent(page);

      // We append the platform name because Android and iOS use different
      // apostrophe characters e.g. (') vs (’)
      expect(adfContent).toMatchCustomDocSnapshot(
        `${testName} - ${page.platform()}`,
      );

      // Re-disable to avoid the native setting leaking into subsequent tests
      await page.disablePredictiveKeyboard();
    },
  );
};

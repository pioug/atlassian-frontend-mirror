import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  editable,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  hyperlinkSelectors,
  linkPickerSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import basicHyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';
import { isFocusTrapped } from './_utils';

BrowserTestCase(
  'can unlink hyperlink using toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.unlinkBtn);
    await page.click(hyperlinkSelectors.unlinkBtn);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'closes hyperlink floating toolbar when hit escape key',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.floatingToolbar);
    await page.keys('Escape');

    expect(await page.isExisting(hyperlinkSelectors.floatingToolbar)).toBe(
      false,
    );
  },
);

// FIXME: This test was automatically skipped due to failure on 15/03/2023: https://product-fabric.atlassian.net/browse/ED-17191
BrowserTestCase(
  'can edit hyperlink text with toolbar',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.type(hyperlinkSelectors.textInput, 'Trello');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can edit hyperlink URL with toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, 'http://trello.com');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'can add anchor link URL with toolbar',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, '#anchor-link');
    await page.keys('Return');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't update hyperlink text if hit escape key",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.waitForSelector(hyperlinkSelectors.textInput);
    await page.type(hyperlinkSelectors.textInput, 'Trello');
    await page.keys('Escape');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't update hyperlink URL if hit escape key",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.clearLinkBtn);
    await page.type(hyperlinkSelectors.linkInput, 'http://trello.com');
    await page.keys('Escape');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  "doesn't close edit link toolbar when text is selected using the mouse and the click is released outside of the toolbar",
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: basicHyperlinkAdf,
    });

    await page.waitForSelector(hyperlinkSelectors.hyperlink);
    await page.click(hyperlinkSelectors.hyperlink);
    await page.waitForSelector(hyperlinkSelectors.editLinkBtn);
    await page.click(hyperlinkSelectors.editLinkBtn);

    const linkInputLocation = await page.getLocation(
      hyperlinkSelectors.linkInput,
    );
    const floatingToolbarLocation = await page.getLocation(
      '[aria-label="Floating Toolbar"]',
    );
    const floatingToolbarSize = await page.getElementSize(
      '[aria-label="Floating Toolbar"]',
    );
    await page.simulateUserDragAndDrop(
      linkInputLocation.x,
      linkInputLocation.y,
      floatingToolbarLocation.x + floatingToolbarSize.width,
      floatingToolbarLocation.y + floatingToolbarSize.height,
      1,
    );

    expect(await page.isExisting(hyperlinkSelectors.linkInput)).toBe(true);
  },
);

describe('with feature flag: lp-link-picker', () => {
  // FIXME: This test was automatically skipped due to failure on 15/03/2023: https://product-fabric.atlassian.net/browse/ED-17191
  BrowserTestCase(
    'can edit hyperlink text with toolbar',
    {
      skip: ['*'],
    },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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
      await page.type(linkPickerSelectors.linkDisplayTextInput, 'Trello');
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    'can edit hyperlink URL with toolbar',
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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
      await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
      await page.click(hyperlinkSelectors.clearLinkBtn);
      await page.type(hyperlinkSelectors.linkInput, 'http://trello.com');
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    'can add anchor link URL with toolbar',
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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
      await page.waitForSelector(hyperlinkSelectors.clearLinkBtn);
      await page.click(hyperlinkSelectors.clearLinkBtn);
      await page.type(hyperlinkSelectors.linkInput, '#anchor-link');
      await page.keys('Return');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );

  BrowserTestCase(
    "doesn't update hyperlink text if hit escape key",
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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
      await page.waitForSelector(linkPickerSelectors.linkDisplayTextInput);
      await page.type(linkPickerSelectors.linkDisplayTextInput, 'Trello');
      await page.keys('Escape');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);

      const editor = await page.$(selectors.editor);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  BrowserTestCase(
    "doesn't update hyperlink URL if hit escape key",
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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
      await page.click(hyperlinkSelectors.clearLinkBtn);
      await page.type(linkPickerSelectors.linkInput, 'http://trello.com');
      await page.keys('Escape');

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);

      const editor = await page.$(selectors.editor);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  BrowserTestCase(
    "doesn't close edit link toolbar when text is selected using the mouse and the click is released outside of the toolbar",
    {},
    async (client: any, testName: string) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          defaultValue: basicHyperlinkAdf,
          featureFlags: {
            'lp-link-picker': true,
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

      const linkInputLocation = await page.getLocation(
        linkPickerSelectors.linkInput,
      );
      const floatingToolbarLocation = await page.getLocation(
        '[aria-label="Floating Toolbar"]',
      );
      const floatingToolbarSize = await page.getElementSize(
        '[aria-label="Floating Toolbar"]',
      );
      await page.simulateUserDragAndDrop(
        linkInputLocation.x,
        linkInputLocation.y,
        floatingToolbarLocation.x + floatingToolbarSize.width,
        floatingToolbarLocation.y + floatingToolbarSize.height,
        1,
      );

      expect(await page.isExisting(linkPickerSelectors.linkInput)).toBe(true);
    },
  );

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

      await page.waitForSelector(hyperlinkSelectors.unlinkBtn);
      const unlinkButton = await page.$(hyperlinkSelectors.unlinkBtn);
      expect(await editor.isFocused()).toBe(false);
      expect(await unlinkButton.isFocused()).toBe(true);

      await page.pause(100);

      // Pressing tab returns focus to editor (not trapped)
      await page.keys(['Tab']);
      expect(await editor.isFocused()).toBe(true);
    },
  );

  describe.each([true, false])(
    'when ff lp-link-picker-focus-trap is %p',
    (featureFlag: boolean) => {
      // FIXME: This test was automatically skipped due to failure on 30/03/2023: https://product-fabric.atlassian.net/browse/ED-17344
      BrowserTestCase(
        `ff lp-link-picker-focus-trap is ${featureFlag}: when editing a link mark, focus ${
          featureFlag ? 'IS' : 'IS NOT'
        } trapped within the link picker`,
        {
          // skip: ['safari'],
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

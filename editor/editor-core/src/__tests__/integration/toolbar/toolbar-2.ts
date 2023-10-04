import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  comment,
  fullpage,
  editable,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  blockTypeMessages,
  toolbarMessages as textFormattingMessages,
} from '@atlaskit/editor-common/messages';

const changeFormatting = `[aria-label="${textFormattingMessages.textStyles.defaultMessage}"]`;
const input = 'helloworld';

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach((editor) => {
  BrowserTestCase(
    `toolbar-2.ts: should be able to select heading1 for ${editor.name} editor`,
    { skip: [] },
    async (client: any) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, { appearance: editor.appearance });

      await page.click(editable);
      await page.waitForSelector(changeFormatting);
      await page.type(editable, input);
      for (let i = 1; i <= 6; i++) {
        await validateFormat(page, i);
      }
    },
  );
});

const validateFormat = async (browser: any, heading: number) => {
  const selector =
    'span=' +
    blockTypeMessages[('heading' + heading) as keyof typeof blockTypeMessages]
      .defaultMessage;
  await browser.click(changeFormatting);
  await browser.waitForSelector(selector);
  await browser.click(selector);
  await browser.waitForSelector(`h${heading}`);
};

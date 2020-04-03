import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlInlineDialog = getExampleUrl('core', 'inline-dialog', 'testing');

/* Css selectors used for the test */
const inlineDialogBtn = "[data-testid='the-button-for-inline-dialog']";
const inlineDialogTestId = "[data-testid='the-inline-dialog']";

BrowserTestCase(
  'InlineDialog should be able to be identified and clicked by data-testid',
  {} as any,
  async (client: any) => {
    const inlineDialogTest = new Page(client);
    await inlineDialogTest.goto(urlInlineDialog);
    await inlineDialogTest.waitFor(inlineDialogBtn, 5000);
    await inlineDialogTest.click(inlineDialogBtn);
    expect(await inlineDialogTest.isVisible(inlineDialogTestId)).toBe(true);
    expect(await inlineDialogTest.getText(inlineDialogTestId)).toContain(
      'Hello!',
    );
  },
);

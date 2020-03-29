import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* URLs to test the examples */
const inlineEditExampleUrl = getExampleUrl(
  'core',
  'inline-edit',
  'basic-usage',
);
const validationExampleUrl = getExampleUrl('core', 'inline-edit', 'validation');

/* Css selectors used for the inline edit tests */
const readViewContentWrapper = 'button[aria-label="Edit"] + div';
const input = 'input[name="inlineEdit"]';
const editButton = 'button[aria-label="Edit"]';
const confirmButton = 'button[aria-label="Confirm"]';
const cancelButton = 'button[aria-label="Cancel"]';
const errorMessage = 'div#error-message';
const label = 'label';

BrowserTestCase(
  'The edit button should have focus after edit is confirmed by pressing Enter',
  {},
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);
    await inlineEditTest.click(label);

    await inlineEditTest.waitForSelector(editButton);
    await inlineEditTest.safariCompatibleTab();
    await inlineEditTest.keys('\uE007');

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys('\uE007');

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(true);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by clicking on the confirm button',
  {},
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(editButton);
    await inlineEditTest.click(label);
    await inlineEditTest.safariCompatibleTab();
    await inlineEditTest.keys('\uE007');

    await inlineEditTest.waitForSelector(confirmButton);
    await inlineEditTest.click(confirmButton);

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit button should not have focus after edit is confirmed by pressing Enter, if edit view entered by mouse click',
  {},
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.keys('\uE007');

    await inlineEditTest.waitForSelector(editButton);
    expect(await inlineEditTest.hasFocus(editButton)).toBe(false);
    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'The edit view should remain open when tab is pressed in the input and when tab is pressed on the confirm button',
  {},
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(inlineEditExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);

    await inlineEditTest.safariCompatibleTab();
    await inlineEditTest.waitForSelector(confirmButton);
    expect(await inlineEditTest.hasFocus(confirmButton)).toBe(true);

    await inlineEditTest.safariCompatibleTab();
    await inlineEditTest.waitForSelector(cancelButton);
    expect(await inlineEditTest.hasFocus(cancelButton)).toBe(true);
    expect(await inlineEditTest.isVisible(input)).toBe(true);

    await inlineEditTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'An error message is displayed correctly',
  {},
  async (client: any) => {
    const inlineEditTest = new Page(client);
    await inlineEditTest.goto(validationExampleUrl);

    await inlineEditTest.waitForSelector(readViewContentWrapper);
    await inlineEditTest.click(readViewContentWrapper);

    await inlineEditTest.waitForSelector(input);
    await inlineEditTest.click('input');
    await inlineEditTest.keys('Backspace');
    await inlineEditTest.keys('Backspace');
    await inlineEditTest.keys('Backspace');
    await inlineEditTest.keys('Backspace');
    await inlineEditTest.keys('Backspace');
    await inlineEditTest.waitForSelector(errorMessage);
    expect(await inlineEditTest.isVisible(errorMessage));

    await inlineEditTest.checkConsoleErrors();
  },
);

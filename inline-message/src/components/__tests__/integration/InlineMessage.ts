import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlInlineMessage = getExampleUrl('core', 'inline-message', 'testing');

/* Css selectors used for the test */
const inlineMessageBtn = "[data-testid='the-inline-message--button']";
const inlineMessageComponent = "[data-testid='the-inline-message']";
const inlineMessageTitle = "[data-testid='the-inline-message--title']";
const inlineMessageText = "[data-testid='the-inline-message--text']";
const inlineMessageContent =
  "[data-testid='the-inline-message--inline-dialog']";
const messageHeading = 'h4';

BrowserTestCase(
  'InlineMessage should be able to be identified and clicked by data-testid',
  {} as any,
  async (client: any) => {
    const inlineMessageTest = new Page(client);
    await inlineMessageTest.goto(urlInlineMessage);

    // Check for visibility.
    expect(await inlineMessageTest.isVisible(inlineMessageBtn)).toBe(true);
    expect(await inlineMessageTest.isVisible(inlineMessageComponent)).toBe(
      true,
    );
    expect(await inlineMessageTest.isVisible(inlineMessageTitle)).toBe(true);
    expect(await inlineMessageTest.isVisible(inlineMessageText)).toBe(true);

    // Check for contents.
    expect(await inlineMessageTest.getText(inlineMessageTitle)).toContain(
      'My testing Inline Message',
    );
    expect(await inlineMessageTest.getText(inlineMessageText)).toContain(
      'Use data-testid for reliable testing',
    );

    // Check for inline dialog / message.
    await inlineMessageTest.click(inlineMessageBtn);
    expect(await inlineMessageTest.isVisible(inlineMessageContent)).toBe(true);
    expect(await inlineMessageTest.getText(messageHeading)).toContain(
      'It is so great to use data-testid',
    );
  },
);

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlTextArea = getExampleUrl('core', 'textarea', 'testing');

/* Css selectors used for the test */
const textAreaTestId = "[data-testid='MyTextAreaTestId']";

BrowserTestCase(
  'TextArea should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const textAreaTest = new Page(client);
    await textAreaTest.goto(urlTextArea);
    await textAreaTest.waitFor(textAreaTestId, 5000);
    expect(await textAreaTest.isVisible(textAreaTestId)).toBe(true);
    expect(await textAreaTest.getValue(textAreaTestId)).toContain(
      'I have a data-testid',
    );
  },
);

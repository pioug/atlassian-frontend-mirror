import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

// Url to test the example
const urlSubmitForm = getExampleUrl('design-system', 'form', 'submit-form');

// Css selectors used for the submit form test
const submitForm = 'form[name="submit-form"]';
const submitFormTextarea = 'textarea[name="description"]';
const submitFormTextfield = 'input[name="name"]';
const submitFormSubmitted = 'div#submitted';

// FIXME: This test was automatically skipped due to failure on 9/7/2021: https://product-fabric.atlassian.net/browse/SKIP-46
BrowserTestCase(
  'Pressing ctrl + enter in the text area after entering input should submit the form',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const formTest = new Page(client);
    await formTest.goto(urlSubmitForm);
    await formTest.waitForSelector(submitForm);
    await formTest.type(submitFormTextfield, 'Jane Chan');
    await formTest.waitForSelector(submitFormTextarea);
    await formTest.click(submitFormTextarea);
    // Use unicode keys for Control & Enter fo FF and Safari
    await formTest.keys('\uE009\uE007');
    await formTest.waitForSelector(submitFormSubmitted);
    expect(await formTest.getText(submitFormSubmitted)).toBe(
      'You have successfully submitted!',
    );
    await formTest.checkConsoleErrors();
  },
);

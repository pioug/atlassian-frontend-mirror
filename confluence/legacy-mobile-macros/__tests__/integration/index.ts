import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
// import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
// const testUrl = getExampleUrl('confluence', 'legacy-mobile-macros', 'basic');

/* Css selectors used for the test */
// const exampleComponent = "[data-testid='legacy-mobile-macros']";

BrowserTestCase('no-op test', { skip: ['edge'] }, async () => {
  // const componentTest = new Page(client);
  // await componentTest.goto(testUrl);

  // Check for visibility.
  // expect(await componentTest.isVisible(exampleComponent)).toBe(true);
  expect(true).toBe(true);
});

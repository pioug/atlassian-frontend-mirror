import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlLozenge = getExampleUrl('core', 'lozenge', 'testing');

/* Css selectors used for the test */
const defaultLozenge = "[data-testid='default-lozenge']";
const newLozenge = "[data-testid='new-lozenge']";
const themedLozenge = "[data-testid='themed-lozenge']";

BrowserTestCase(
  'Lozenge should be able to be identified by data-testid',
  {} as any,
  async (client: any) => {
    const lozengeTest = new Page(client);
    await lozengeTest.goto(urlLozenge);

    // Check for visibility.
    expect(await lozengeTest.isVisible(defaultLozenge)).toBe(true);
    expect(await lozengeTest.isVisible(newLozenge)).toBe(true);
    expect(await lozengeTest.isVisible(themedLozenge)).toBe(true);

    // Check for content
    // Depending on the browser the content case can be rendered differently.
    expect((await lozengeTest.getText(defaultLozenge)).toLowerCase()).toContain(
      'default',
    );
    expect((await lozengeTest.getText(newLozenge)).toLowerCase()).toContain(
      'new',
    );
    expect((await lozengeTest.getText(themedLozenge)).toLowerCase()).toContain(
      'success',
    );

    // Check for css property - green is #008000.
    expect(
      (await lozengeTest.getCSSProperty(themedLozenge, 'background-color'))
        .parsed!.hex,
    ).toContain('#008000');
  },
);

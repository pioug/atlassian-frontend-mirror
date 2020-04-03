import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlToggle = getExampleUrl('core', 'toggle', 'testing');

/* Css selectors used for the test */
const toggleStateless = "[data-testid='my-toggle-stateless']";
const toggleBtn = "[data-testid='my-toggle-button']";
const toggleRegular = "[data-testid='my-regular-stateful-toggle']";
const toggleLarge = "[data-testid='my-large-stateful-toggle']";
const toggleStatelessInput = "[data-testid='my-toggle-stateless--input']";
const toggleLargeInput = "[data-testid='my-large-stateful-toggle--input']";

BrowserTestCase(
  'Toggle should be able to be identified and checked by data-testid',
  {} as any,
  async (client: any) => {
    const toggleTest = new Page(client);
    await toggleTest.goto(urlToggle);
    await toggleTest.waitFor(toggleBtn, 5000);

    expect(await toggleTest.isVisible(toggleStateless)).toBe(true);
    expect(await toggleTest.isVisible(toggleRegular)).toBe(true);
    expect(await toggleTest.isVisible(toggleLarge)).toBe(true);

    // Click on the toggle button stateless.
    await toggleTest.click(toggleBtn);
    expect(await toggleTest.isSelected(toggleStatelessInput)).toBe(true);

    // You can't interact with a stateless toggle so clicking should not change the state.
    await toggleTest.click(toggleStateless);
    expect(await toggleTest.isSelected(toggleStatelessInput)).toBe(true);

    // You can interact with a stateful toggle.
    await toggleTest.click(toggleRegular);
    expect(await toggleTest.isSelected(toggleRegular)).toBe(false);

    // You can get the state.
    expect(await toggleTest.isSelected(toggleLargeInput)).toBe(true);
  },
);

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl(
  'design-system',
  'avatar-group',
  'non-interactive-avatar-group',
);

/* Css selectors used for the test */
const avatarGroup = "[data-testid='overrides--avatar-group']";
const avatarInsideSpan = "[data-testid='overrides--avatar-0--inner']";
const overflowMenuTrigger = "[data-testid='overrides--overflow-menu--trigger']";
const overflowMenuItemInsideSpan =
  "[data-testid='overrides--avatar-group-item-4']";

BrowserTestCase(
  'should have non interactive avatar inside span',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitForSelector(avatarGroup);
    const actualTag = await testPage.getTagName(avatarInsideSpan);
    expect(['SPAN', 'span'].includes(actualTag)).toBe(true);
  },
);

BrowserTestCase(
  'should have non interactive overflowed avatar items inside span',
  {},
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitForSelector(avatarGroup);
    await testPage.click(overflowMenuTrigger);
    const actualTag = await testPage.getTagName(overflowMenuItemInsideSpan);
    expect(['SPAN', 'span'].includes(actualTag)).toBe(true);
  },
);

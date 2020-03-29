import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlBadge = getExampleUrl('core', 'badge', 'testing');

/* Css selectors used for the test */
const myBadgeAdded = "[data-testid='myBadgeAdded']";
const myBadgeDefault = "[data-testid='myBadgeDefault']";
const myBadgeImportant = "[data-testid='myBadgeImportant']";
const myBadgePrimary = "[data-testid='myBadgePrimary']";

BrowserTestCase(
  'Badge should be identified and visible by data-testid',
  {} as any,
  async (client: any) => {
    const badgeTest = new Page(client);
    await badgeTest.goto(urlBadge);
    await badgeTest.waitFor(myBadgeAdded, 5000);
    expect(await badgeTest.isVisible(myBadgeAdded)).toBe(true);
    expect(await badgeTest.isVisible(myBadgeDefault)).toBe(true);
    expect(await badgeTest.isVisible(myBadgeImportant)).toBe(true);
    expect(await badgeTest.isVisible(myBadgePrimary)).toBe(true);
    expect(await badgeTest.getText(myBadgeAdded)).toBe('2');
    expect(await badgeTest.getText(myBadgeDefault)).toBe('67');
    expect(await badgeTest.getText(myBadgeImportant)).toBe('20');
    expect(await badgeTest.getText(myBadgePrimary)).toBe('19');
  },
);

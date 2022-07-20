import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
function getURL(testName: string): string {
  return getExampleUrl(
    'linking-platform',
    'link-picker',
    testName,
    global.__BASEURL__,
  );
}

/* Css selectors used for the test */
const component = "[data-testid='link-picker']";
const linkUrl = "[data-testid='link-url']";
const linkText = "[data-testid='link-text']";
const clearText = "[data-testid='clear-text']";
const saveButton = "[data-testid='link-picker-insert-button']";

BrowserTestCase(
  'Link picker should be able to be edit link and title without plugins',
  {},
  async (client: any) => {
    const page = new Page(client);
    const exampleUrl = getURL('without-plugins');

    await page.goto(exampleUrl);
    await page.waitFor(component);

    await page.type(linkUrl, 'https://google.com');
    await page.type(linkText, 'Inserted');
    await page.click(saveButton);

    await page.click('a');
    await page.click(clearText);
    await page.type(linkUrl, 'https://atlassian.com');
    await page.type(linkText, 'Edited');
    await page.click(saveButton);

    expect(await page.isExisting(component)).toBe(false);
    expect(await page.getHTML('a')).toMatch('Edited');
    expect(await page.getProperty('a', 'href')).toMatch(
      'https://atlassian.com',
    );
  },
);

BrowserTestCase(
  'Link picker should be able to edit link and title from search results',
  {},
  async (client: any) => {
    const page = new Page(client);
    const exampleUrl = getURL('with-plugins');
    await page.goto(exampleUrl);
    await page.waitFor(component);

    await page.type(linkUrl, 'https://google.com');
    await page.type(linkText, 'Inserted');
    await page.click(saveButton);

    await page.click('a');
    await page.waitFor(component);
    await page.click(clearText);
    await page.click(linkUrl);
    await page.keys('ArrowDown');

    const selected = await page.getValue(linkUrl);
    await page.type(linkText, 'Edited');
    await page.click(saveButton);

    expect(await page.isExisting(component)).toBe(false);
    expect(await page.getHTML('a')).toMatch('Edited');
    expect(await page.getProperty('a', 'href')).toMatch(selected);
    expect(await page.getProperty('a', 'href')).not.toMatch(
      'https://google.com/',
    );
  },
);

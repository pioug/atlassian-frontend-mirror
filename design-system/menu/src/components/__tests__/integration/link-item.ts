import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const exampleUrl = getExampleUrl('design-system', 'menu', 'link-item');

const getLinkSelector = (position: number) =>
  `#examples a[href="#link-item${position}"]`;

BrowserTestCase(
  'Selected nav items should have aria-current="page" attribute',
  {},
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(exampleUrl);

    const [linkItem1, linkItem2, linkItem3, linkItem4] = [
      getLinkSelector(1),
      getLinkSelector(2),
      getLinkSelector(3),
      getLinkSelector(4),
    ];

    await page.waitForSelector(linkItem2);
    expect(await page.getAttribute(linkItem2, 'aria-current')).toBe('page');

    await page.waitForSelector(linkItem1);
    await page.click(linkItem1);
    expect(await page.getAttribute(linkItem1, 'aria-current')).toBe('page');
    expect(await page.getAttribute(linkItem2, 'aria-current')).toBe(null);

    expect(await page.isExisting(linkItem3)).toBe(false);

    await page.waitForSelector(linkItem4);
    await page.click(linkItem4);
    expect(await page.getAttribute(linkItem4, 'aria-current')).toBe('page');
    expect(await page.getAttribute(linkItem1, 'aria-current')).toBe(null);
    expect(await page.getAttribute(linkItem2, 'aria-current')).toBe(null);

    await page.checkConsoleErrors();
  },
);

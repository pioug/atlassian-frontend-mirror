import { expect, test } from '@af/integration-testing';

const getLinkSelector = (position: number) =>
  `#examples a[href="#link-item${position}"]`;

test('Selected nav items should have aria-current="page" attribute', async ({
  page,
}) => {
  await page.visitExample('design-system', 'menu', 'link-item');

  const [linkItem1, linkItem2, linkItem3, linkItem4] = [
    getLinkSelector(1),
    getLinkSelector(2),
    getLinkSelector(3),
    getLinkSelector(4),
  ];

  await expect(page.locator(linkItem2).first()).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.locator(linkItem1).first().click();
  await expect(page.locator(linkItem1).first()).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    await page.locator(linkItem2).first().getAttribute('aria-current'),
  ).toBeNull();

  expect(await page.webdriverCompatUtils.isDetached(linkItem3)).toBe(true);

  await page.locator(linkItem4).first().click();
  await expect(page.locator(linkItem4).first()).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    await page.locator(linkItem1).first().getAttribute('aria-current'),
  ).toBeNull();
  expect(
    await page.locator(linkItem2).first().getAttribute('aria-current'),
  ).toBeNull();
});

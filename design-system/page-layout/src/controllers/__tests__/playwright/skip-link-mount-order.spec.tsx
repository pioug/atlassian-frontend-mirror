import { expect, type Page, test } from '@af/integration-testing';

const skipLink = "[data-skip-link-wrapper='true'] a";

const toggleBanner = '#toggle-banner';

const toggleTopNavigation = '#toggle-top-navigation';

const toggleLeftSidebar = '#toggle-left-sidebar';

const toggleMain = '#toggle-main';

const toggleRightSidebar = '#toggle-right-sidebar';

const toggleRightPanel = '#toggle-right-panel';

async function getLinkFragments(page: Page) {
  const links = await page.locator(skipLink).all();
  const linkFragmentPromises = links.map(async (link) => {
    const href = await link.getAttribute('href');
    return href?.split('#')[1];
  });

  return Promise.all(linkFragmentPromises);
}

const expectedOrder = [
  'banner',
  'top-navigation',
  'left-panel',
  'left-sidebar',
  'main',
  'right-sidebar',
  'right-panel',
];

test('Links should have DOM order by default', async ({ page }) => {
  await page.visitExample(
    'design-system',
    'page-layout',
    'customizable-page-layout',
  );

  const linkFragments = await getLinkFragments(page);
  expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting the first slot (banner) should maintain its order', async ({
  page,
}) => {
  await page.visitExample(
    'design-system',
    'page-layout',
    'customizable-page-layout',
  );
  await page.locator(toggleBanner).first().click();
  let linkFragments = await getLinkFragments(page);
  expect(linkFragments).not.toStrictEqual(expectedOrder);

  await page.locator(toggleBanner).first().click();
  linkFragments = await getLinkFragments(page);
  expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting an arbitrary slot (left-sidebar) should maintain its order', async ({
  page,
}) => {
  await page.visitExample(
    'design-system',
    'page-layout',
    'customizable-page-layout',
  );
  await page.locator(toggleLeftSidebar).first().click();
  let linkFragments = await getLinkFragments(page);
  expect(linkFragments).not.toStrictEqual(expectedOrder);

  await page.locator(toggleLeftSidebar).first().click();
  linkFragments = await getLinkFragments(page);
  expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting the last slot (right-panel) should maintain its order', async ({
  page,
}) => {
  await page.visitExample(
    'design-system',
    'page-layout',
    'customizable-page-layout',
  );
  await page.locator(toggleRightPanel).first().click();
  let linkFragments = await getLinkFragments(page);
  expect(linkFragments).not.toStrictEqual(expectedOrder);

  await page.locator(toggleRightPanel).first().click();
  linkFragments = await getLinkFragments(page);
  expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting many items randomly should maintain order', async ({
  page,
}) => {
  await page.visitExample(
    'design-system',
    'page-layout',
    'customizable-page-layout',
  );
  await page.locator(toggleRightPanel).first().click();
  await page.locator(toggleTopNavigation).first().click();
  await page.locator(toggleMain).first().click();
  await page.locator(toggleRightSidebar).first().click();
  let linkFragments = await getLinkFragments(page);
  expect(linkFragments).not.toStrictEqual(expectedOrder);

  await page.locator(toggleTopNavigation).first().click();
  await page.locator(toggleRightPanel).first().click();
  await page.locator(toggleRightSidebar).first().click();
  await page.locator(toggleMain).first().click();
  linkFragments = await getLinkFragments(page);
  expect(linkFragments).toStrictEqual(expectedOrder);
});

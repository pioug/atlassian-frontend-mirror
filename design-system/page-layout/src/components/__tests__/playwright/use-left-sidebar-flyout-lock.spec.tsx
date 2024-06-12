import { expect, type Page, test } from '@af/integration-testing';

const leftSidebar = "[data-testid='left-sidebar']";
const rightSidebar = "[data-testid='right-sidebar']";
const resizeControl = "[data-testid='left-sidebar-resize-button']";
const mainContent = "[data-ds--page-layout--slot='main']";
const popupTrigger = "[data-testid='popup-trigger']";
const sideNavigation = `${leftSidebar} > div > div:not([data-resize-control])`;

const collapseSidebarIfOpen = async (page: Page) => {
	if ((await page.locator(resizeControl).getAttribute('aria-expanded')) === 'true') {
		await page.click(resizeControl);
	}
};

test('Hovering the sidebar opens the flyout', async ({ page }) => {
	await page.visitExample('design-system', 'page-layout', 'locked-sidebar');

	await collapseSidebarIfOpen(page);
	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeHidden();
	await page.locator(leftSidebar).first().hover();

	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeVisible();
});

test('The flyout is not locked by default', async ({ page }) => {
	await page.visitExample('design-system', 'page-layout', 'locked-sidebar');

	await collapseSidebarIfOpen(page);
	await page.locator(leftSidebar).first().hover();

	const mainContentBounds = await page.locator(mainContent).first().boundingBox();
	const sideNavigationBounds = await page.locator(sideNavigation).first().boundingBox();

	await page.mouse.move(
		mainContentBounds!.x + sideNavigationBounds!.width + 100,
		mainContentBounds!.y,
	);

	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeHidden();
});

test('The lock prevents the flyout state from automatically collapsing', async ({ page }) => {
	await page.visitExample('design-system', 'page-layout', 'locked-sidebar');

	await collapseSidebarIfOpen(page);
	await page.locator(leftSidebar).first().hover();
	await page.locator(popupTrigger).first().click();

	const mainContentBounds = await page.locator(mainContent).first().boundingBox();
	const sideNavigationBounds = await page.locator(sideNavigation).first().boundingBox();

	await page.mouse.move(
		mainContentBounds!.x + sideNavigationBounds!.width + 100,
		mainContentBounds!.y,
	);

	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeVisible();
});

test('Releasing the lock while the cursor is outside of the sidebar will make the flyout collapse', async ({
	page,
}) => {
	await page.visitExample('design-system', 'page-layout', 'locked-sidebar');

	await collapseSidebarIfOpen(page);
	await page.locator(leftSidebar).first().hover();

	await page.locator(popupTrigger).first().click();
	await page.locator(rightSidebar).first().click();
	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeHidden();
});

test('Releasing the lock while the cursor is inside of the sidebar will make the flyout stay open', async ({
	page,
}) => {
	await page.visitExample('design-system', 'page-layout', 'locked-sidebar');

	await collapseSidebarIfOpen(page);
	await page.locator(leftSidebar).first().hover();

	await page.locator(popupTrigger).first().click();
	await page.locator(leftSidebar).first().click();

	await expect(page.locator(resizeControl)).toHaveAttribute('aria-expanded', 'false');
	await expect(page.locator(sideNavigation)).toBeVisible();
});

import { expect, type Page, test } from '@af/integration-testing';

const skipLink = "[data-skip-link-wrapper='true'] a";

const toggleBanner = '#toggle-banner';

const toggleTopNavigation = '#toggle-top-navigation';

const toggleLeftSidebar = '#toggle-left-sidebar';

const toggleMain = '#toggle-main';

const toggleRightSidebar = '#toggle-right-sidebar';

const toggleRightPanel = '#toggle-right-panel';

async function getLinkFragments(page: Page) {
	// Wait for skip links to be fully registered and rendered using locator-based approach
	await expect(page.locator(skipLink).first()).toBeVisible({ timeout: 10000 });

	// Additional wait to ensure all skip links are registered after DOM changes
	await page.waitForFunction(
		(selector) => {
			const links = document.querySelectorAll(selector);
			// Ensure we have the expected number of skip links and they're all properly rendered
			return (
				links.length > 0 &&
				Array.from(links).every((link) => {
					const href = link.getAttribute('href');
					return href && href.includes('#');
				})
			);
		},
		skipLink,
		{ timeout: 10000 },
	);

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
	await page.visitExample<typeof import('../../../../examples/00-customizable-page-layout.tsx')>(
		'design-system',
		'page-layout',
		'customizable-page-layout',
	);

	const linkFragments = await getLinkFragments(page);
	expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting the first slot (banner) should maintain its order', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/00-customizable-page-layout.tsx')>(
		'design-system',
		'page-layout',
		'customizable-page-layout',
	);
	await page.locator(toggleBanner).first().click();
	// Wait for DOM to stabilize after unmounting by checking link count changes
	await expect(page.locator(skipLink)).not.toHaveCount(expectedOrder.length, { timeout: 5000 });
	let linkFragments = await getLinkFragments(page);
	expect(linkFragments).not.toStrictEqual(expectedOrder);

	await page.locator(toggleBanner).first().click();
	// Wait for DOM to stabilize after remounting by checking link count restored
	await expect(page.locator(skipLink)).toHaveCount(expectedOrder.length, { timeout: 5000 });
	linkFragments = await getLinkFragments(page);
	expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting an arbitrary slot (left-sidebar) should maintain its order', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/00-customizable-page-layout.tsx')>(
		'design-system',
		'page-layout',
		'customizable-page-layout',
	);
	await page.locator(toggleLeftSidebar).first().click();
	// Wait for DOM to stabilize after unmounting by checking link count changes
	await expect(page.locator(skipLink)).not.toHaveCount(expectedOrder.length, { timeout: 5000 });
	let linkFragments = await getLinkFragments(page);
	expect(linkFragments).not.toStrictEqual(expectedOrder);

	await page.locator(toggleLeftSidebar).first().click();
	// Wait for DOM to stabilize after remounting by checking link count restored
	await expect(page.locator(skipLink)).toHaveCount(expectedOrder.length, { timeout: 5000 });
	linkFragments = await getLinkFragments(page);
	expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting the last slot (right-panel) should maintain its order', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/00-customizable-page-layout.tsx')>(
		'design-system',
		'page-layout',
		'customizable-page-layout',
	);
	await page.locator(toggleRightPanel).first().click();
	// Wait for DOM to stabilize after unmounting by checking link count changes
	await expect(page.locator(skipLink)).not.toHaveCount(expectedOrder.length, { timeout: 5000 });
	let linkFragments = await getLinkFragments(page);
	expect(linkFragments).not.toStrictEqual(expectedOrder);

	await page.locator(toggleRightPanel).first().click();
	// Wait for DOM to stabilize after remounting by checking link count restored
	await expect(page.locator(skipLink)).toHaveCount(expectedOrder.length, { timeout: 5000 });
	linkFragments = await getLinkFragments(page);
	expect(linkFragments).toStrictEqual(expectedOrder);
});

test('Remounting many items randomly should maintain order', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/00-customizable-page-layout.tsx')>(
		'design-system',
		'page-layout',
		'customizable-page-layout',
	);
	await page.locator(toggleRightPanel).first().click();
	await page.locator(toggleTopNavigation).first().click();
	await page.locator(toggleMain).first().click();
	await page.locator(toggleRightSidebar).first().click();
	// Wait for DOM to stabilize after multiple unmounting operations by checking significant link count change
	await expect(page.locator(skipLink)).not.toHaveCount(expectedOrder.length, { timeout: 5000 });
	let linkFragments = await getLinkFragments(page);
	expect(linkFragments).not.toStrictEqual(expectedOrder);

	await page.locator(toggleTopNavigation).first().click();
	await page.locator(toggleRightPanel).first().click();
	await page.locator(toggleRightSidebar).first().click();
	await page.locator(toggleMain).first().click();
	// Wait for DOM to stabilize after multiple remounting operations by checking link count restored
	await expect(page.locator(skipLink)).toHaveCount(expectedOrder.length, { timeout: 5000 });
	linkFragments = await getLinkFragments(page);
	expect(linkFragments).toStrictEqual(expectedOrder);
});

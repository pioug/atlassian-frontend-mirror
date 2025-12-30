import { expect, test } from '@af/integration-testing';

/**
 * We disable pointer events on the top nav and re-enable them on the top nav slots.
 *
 * This test checks our top nav items are actually interactive.
 */
test('pointer events on top nav items', async ({ page }) => {
	await page.visitExample('design-system', 'navigation-system', 'composition', {
		featureFlag: 'navx-full-height-sidebar',
	});

	const log: string[] = [];
	page.on('console', (msg) => log.push(msg.text()));

	await page.getByRole('button', { name: 'Switch apps' }).click();
	expect(log.at(-1)).toEqual('app switcher clicked');

	await page.getByRole('button', { name: 'Create' }).click();
	expect(log.at(-1)).toEqual('create button clicked');

	await page.getByRole('button', { name: 'Help' }).click();
	expect(log.at(-1)).toEqual('help button clicked');
});

test('pointer events on top nav items [layering improvements enabled]', async ({ page }) => {
	await page.visitExample('design-system', 'navigation-system', 'composition', {
		featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
	});

	const log: string[] = [];
	page.on('console', (msg) => log.push(msg.text()));

	await page.getByRole('button', { name: 'Switch apps' }).click();
	expect(log.at(-1)).toEqual('app switcher clicked');

	await page.getByRole('button', { name: 'Create' }).click();
	expect(log.at(-1)).toEqual('create button clicked');

	await page.getByRole('button', { name: 'Help' }).click();
	expect(log.at(-1)).toEqual('help button clicked');
});

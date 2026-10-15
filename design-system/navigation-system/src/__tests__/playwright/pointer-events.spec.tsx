import { expect, test } from '@af/integration-testing';

/**
 * This test checks our top nav items are actually interactive.
 */
test('pointer events on top nav items', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/composition.vr.ap.tsx')>(
		'design-system',
		'navigation-system',
		'composition',
	);

	const log: string[] = [];
	page.on('console', (msg) => log.push(msg.text()));

	await page.getByRole('button', { name: 'Switch apps' }).click();
	expect(log.at(-1)).toEqual('app switcher clicked');

	await page.getByRole('button', { name: 'Create' }).click();
	expect(log.at(-1)).toEqual('create button clicked');

	await page.getByRole('button', { name: 'Help' }).click();
	expect(log.at(-1)).toEqual('help button clicked');
});

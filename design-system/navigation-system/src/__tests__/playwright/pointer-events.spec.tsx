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
	const expectLastLog = async (message: string) => {
		await expect.poll(() => log.at(-1)).toBe(message);
	};

	await page.getByRole('button', { name: 'Switch apps' }).click();
	await expectLastLog('app switcher clicked');

	await page.getByRole('button', { name: 'Create' }).click();
	await expectLastLog('create button clicked');

	await page.getByRole('button', { name: 'Help' }).click();
	await expectLastLog('help button clicked');
});

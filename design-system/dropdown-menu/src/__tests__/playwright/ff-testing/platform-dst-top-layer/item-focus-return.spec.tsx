import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * Choosing an item puts focus on the trigger (APG menu button), as the legacy menu does. Focus
 * moves before the item's change applies, so it also lands on the trigger when the same click
 * disables, removes or re-keys the item, and after a mouse press in Safari, which does not focus the
 * pressed item. See `@atlaskit/top-layer` `notes/architecture/focus.md`.
 */

async function visit({ page, isTopLayer }: { page: Page; isTopLayer: boolean }) {
	// No entry animation, so a menu is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<
		typeof import('../../../../../examples/99-testing-item-focus-return.tsx')
	>(
		'design-system',
		'dropdown-menu',
		'testing-item-focus-return',
		isTopLayer ? { featureFlag } : {},
	);
}

/**
 * Opens the menu from its trigger by keyboard, and chooses its first item by keyboard, so every
 * engine focuses the item (Safari does not focus a button on a mouse press).
 */
async function activateByKeyboard({ page, name }: { page: Page; name: string }) {
	await page.getByTestId(`${name}--trigger`).focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId(`${name}-item`)).toBeFocused();
	await page.keyboard.press('Enter');
}

/**
 * Waits two frames, so focus code that runs a frame after the click has run.
 */
async function waitTwoFrames({ page }: { page: Page }) {
	await page.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			),
	);
}

const changedItemCases = [
	{ name: 'disabled', description: 'is disabled' },
	{ name: 'removed', description: 'is removed' },
	{ name: 'swapped', description: 'swaps to an item with a new key' },
	{ name: 'rekeyed', description: 'renders again with a new key' },
];

for (const { isTopLayer, title } of [
	{ isTopLayer: true, title: 'DropdownMenu top-layer: choosing an item focuses the trigger' },
	{ isTopLayer: false, title: 'DropdownMenu legacy: choosing an item focuses the trigger' },
]) {
	test.describe(title, () => {
		for (const { name, description } of changedItemCases) {
			test(`when the item ${description} by the same click`, async ({ page }) => {
				await visit({ page, isTopLayer });

				await activateByKeyboard({ page, name });

				await expect(page.getByTestId(`${name}--content`)).toBeHidden();
				await expect(page.getByTestId(`${name}--trigger`)).toBeFocused();
			});
		}

		// Safari does not focus the pressed item.
		test('after a mouse press on the item', async ({ page }) => {
			await visit({ page, isTopLayer });

			await page.getByTestId('plain--trigger').click();
			await page.getByTestId('plain-item').click();

			await expect(page.getByTestId('plain--content')).toBeHidden();
			await expect(page.getByTestId('plain--trigger')).toBeFocused();
		});

		// A controlled menu that its consumer keeps open.
		test('when the menu stays open', async ({ page }) => {
			await visit({ page, isTopLayer });

			await activateByKeyboard({ page, name: 'stays-open' });

			await waitTwoFrames({ page });
			await expect(page.getByTestId('stays-open--content')).toBeVisible();
			await expect(page.getByTestId('stays-open--trigger')).toBeFocused();
		});
	});
}

test.describe('DropdownMenu top-layer: choosing an item', () => {
	// The legacy menu closes only the nested menu, and focuses its trigger in the root menu.
	test('in a nested menu closes every menu and focuses the root trigger', async ({ page }) => {
		await visit({ page, isTopLayer: true });
		await page.getByTestId('nested--trigger').focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('nested-submenu-trigger')).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(page.getByTestId('nested-item')).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('nested--content')).toBeHidden();
		await expect(page.getByTestId('nested--trigger')).toBeFocused();
	});

	test('leaves focus that the item moved to another element', async ({ page }) => {
		await visit({ page, isTopLayer: true });

		await activateByKeyboard({ page, name: 'moves-focus' });

		await expect(page.getByTestId('moves-focus--content')).toBeHidden();
		await waitTwoFrames({ page });
		await expect(page.getByTestId('moves-focus-target')).toBeFocused();
	});
});

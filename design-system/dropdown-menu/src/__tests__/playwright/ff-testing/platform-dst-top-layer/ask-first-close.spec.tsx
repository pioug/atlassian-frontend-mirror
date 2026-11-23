import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * Smoke test: on the top layer, a controlled `DropdownMenu` asks `onOpenChange` first, and closes
 * only when `isOpen` becomes `false`. `@atlaskit/top-layer` covers the behaviour in full, in all
 * browsers (`manual-ask-first-close.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/wrappers-ask-first-close.md`.
 */

test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	// No entry animation, so a menu is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<typeof import('../../../../../examples/99-testing-ask-first-close.tsx')>(
		'design-system',
		'dropdown-menu',
		'testing-ask-first-close',
		{ featureFlag },
	);
});

function getMenu({ page, name }: { page: Page; name: string }) {
	return page.getByTestId(`${name}--content`);
}

/**
 * Opens the root menu from its trigger by keyboard, so the trigger is the element that had focus
 * at open in every browser (Safari does not focus a button on click).
 */
async function openRoot({ page }: { page: Page }) {
	await page.getByTestId('root--trigger').focus();
	await page.keyboard.press('Enter');
	await expect(getMenu({ page, name: 'root' })).toBeVisible();
	await expect(page.getByTestId('root-item')).toBeFocused();
}

test.describe('DropdownMenu top-layer: ask first on close', () => {
	test('an outside press that onOpenChange refuses keeps the menu open and visible', async ({
		page,
	}) => {
		await page.getByTestId('root-refuse').click();
		await openRoot({ page });

		await page.getByTestId('outside').click();

		await expect(page.getByTestId('close-log')).toHaveText('root:outside-press');
		await expect(getMenu({ page, name: 'root' })).toBeVisible();
		await expect(page.getByTestId('root--trigger')).toHaveAttribute('aria-expanded', 'true');
	});

	test('an accepted Escape closes the menu, and focus returns to the trigger', async ({ page }) => {
		await openRoot({ page });

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('close-log')).toHaveText('root:escape');
		await expect(getMenu({ page, name: 'root' })).toBeHidden();
		await expect(page.getByTestId('root--trigger')).toBeFocused();
	});

	// The nested menu renders in place, inside the root menu, so a press in it is not an outside
	// press for the root. A press on an item would close every menu (an item select), so press the
	// edge of the nested menu, outside its items.
	test('a press in the nested menu does not ask either menu to close', async ({ page }) => {
		await openRoot({ page });
		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('nested-trigger')).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(getMenu({ page, name: 'nested' })).toBeVisible();

		await getMenu({ page, name: 'nested' }).click({ position: { x: 1, y: 1 } });

		await expect(page.getByTestId('close-log')).toHaveText('');
		await expect(getMenu({ page, name: 'nested' })).toBeVisible();
		await expect(getMenu({ page, name: 'root' })).toBeVisible();
	});
});

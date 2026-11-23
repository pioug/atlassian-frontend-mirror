import { expect, type Page, test } from '@af/integration-testing';

/**
 * A `manual` `Popover` with `useManualLightDismiss` and a controlled `isOpen`: an outside press or
 * Escape only asks (`onClose`), and the popover hides only when its owner sets `isOpen` to `false`.
 * The owner can refuse. This is how the DS wrappers (`Popup`, `DropdownMenu`, `PopupSelect`,
 * `InlineDialog`) close on the top layer, so their own specs keep only a smoke test.
 *
 * Layers open by keyboard, so the trigger is the element that had focus at open in every browser
 * (Safari does not focus a button on a click).
 *
 * See notes/decisions/wrappers-ask-first-close.md and
 * notes/decisions/manual-light-dismiss-escape-stacking.md.
 */

type TLayerName = 'first' | 'nested' | 'second';

test.beforeEach(async ({ page }) => {
	await page.visitExample<typeof import('../../examples/173-testing-manual-ask-first-close.tsx')>(
		'design-system',
		'top-layer',
		'testing-manual-ask-first-close',
	);
});

function getLayer({ page, name }: { page: Page; name: TLayerName }) {
	return page.getByTestId(`${name}-layer`);
}

function getLog({ page }: { page: Page }) {
	return page.getByTestId('close-log');
}

/**
 * Makes the owner of `name` refuse a close. Call it before the layer opens: a press on the switch
 * while the layer is open is an outside press.
 */
async function refuse({ page, name }: { page: Page; name: TLayerName }) {
	await page.getByTestId(`${name}-refuse`).click();
	await expect(page.getByTestId(`${name}-refuse`)).toHaveAttribute('aria-pressed', 'true');
}

async function openLayer({ page, name }: { page: Page; name: TLayerName }) {
	await page.getByTestId(`${name}-trigger`).focus();
	await page.keyboard.press('Enter');
	await expect(getLayer({ page, name })).toBeVisible();
	// `role="dialog"`: the first focusable element takes focus.
	await expect(page.getByTestId(`${name}-button`)).toBeFocused();
}

async function expectOpen({ page, name }: { page: Page; name: TLayerName }) {
	const layer = getLayer({ page, name });
	await expect(layer).toBeVisible();
	expect(await layer.evaluate((element) => element.matches(':popover-open'))).toBe(true);
}

test.describe('Manual popover with useManualLightDismiss: ask first, close second', () => {
	test('an outside press that the owner refuses keeps the layer open, and leaves focus where the press put it', async ({
		page,
	}) => {
		await refuse({ page, name: 'first' });
		await openLayer({ page, name: 'first' });

		await page.getByTestId('outside-field').click();

		await expect(getLog({ page })).toHaveText('first:light-dismiss');
		await expectOpen({ page, name: 'first' });
		await expect(page.getByTestId('outside-field')).toBeFocused();
	});

	test('an outside press that the owner accepts closes the layer, and focus stays where the user pressed', async ({
		page,
	}) => {
		await openLayer({ page, name: 'first' });

		await page.getByTestId('outside-field').click();

		await expect(getLog({ page })).toHaveText('first:light-dismiss');
		await expect(getLayer({ page, name: 'first' })).toBeHidden();
		await expect(page.getByTestId('outside-field')).toBeFocused();
	});

	test('an Escape that the owner refuses asks once, and keeps the layer open with focus in it', async ({
		page,
	}) => {
		await refuse({ page, name: 'first' });
		await openLayer({ page, name: 'first' });

		await page.keyboard.press('Escape');

		await expect(getLog({ page })).toHaveText('first:escape');
		await expectOpen({ page, name: 'first' });
		await expect(page.getByTestId('first-button')).toBeFocused();
	});

	test('an Escape that the owner accepts closes the layer, and focus returns to the opener', async ({
		page,
	}) => {
		await openLayer({ page, name: 'first' });

		await page.keyboard.press('Escape');

		await expect(getLog({ page })).toHaveText('first:escape');
		await expect(getLayer({ page, name: 'first' })).toBeHidden();
		await expect(page.getByTestId('first-trigger')).toBeFocused();
	});

	test('a press inside a nested layer asks neither layer', async ({ page }) => {
		await openLayer({ page, name: 'first' });
		await openLayer({ page, name: 'nested' });

		await page.getByTestId('nested-text').click();

		await expectOpen({ page, name: 'nested' });
		await expectOpen({ page, name: 'first' });
		await expect(getLog({ page })).toHaveText('');
	});

	test('a press on the trigger of another layer asks the first layer, and the other layer opens', async ({
		page,
	}) => {
		await openLayer({ page, name: 'first' });

		await page.getByTestId('second-trigger').click();

		await expect(getLog({ page })).toHaveText('first:light-dismiss');
		await expect(getLayer({ page, name: 'first' })).toBeHidden();
		await expectOpen({ page, name: 'second' });
	});

	test('a press on a second toggle whose aria-controls lists the layer closes it once, without asking', async ({
		page,
	}) => {
		await openLayer({ page, name: 'first' });

		await page.getByTestId('first-other-toggle').click();

		// The toggle's own click closed the layer. The owner was not asked, so it did not close the
		// layer at the press and then open it again at the click.
		await expect(getLayer({ page, name: 'first' })).toBeHidden();
		await expect(getLog({ page })).toHaveText('first:toggle');
	});

	test('with two layers open, one Escape closes one layer, innermost first', async ({ page }) => {
		await openLayer({ page, name: 'first' });
		await openLayer({ page, name: 'nested' });

		await page.keyboard.press('Escape');

		await expect(getLog({ page })).toHaveText('nested:escape');
		await expect(getLayer({ page, name: 'nested' })).toBeHidden();
		await expectOpen({ page, name: 'first' });
		await expect(page.getByTestId('nested-trigger')).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(getLog({ page })).toHaveText('nested:escape first:escape');
		await expect(getLayer({ page, name: 'first' })).toBeHidden();
		await expect(page.getByTestId('first-trigger')).toBeFocused();
	});

	test('an Escape that the inner owner refuses keeps both layers open', async ({ page }) => {
		await refuse({ page, name: 'nested' });
		await openLayer({ page, name: 'first' });
		await openLayer({ page, name: 'nested' });

		await page.keyboard.press('Escape');

		await expect(getLog({ page })).toHaveText('nested:escape');
		await expectOpen({ page, name: 'nested' });
		await expectOpen({ page, name: 'first' });
		await expect(page.getByTestId('nested-button')).toBeFocused();
	});

	test('a held Escape asks once', async ({ page }) => {
		await refuse({ page, name: 'first' });
		await openLayer({ page, name: 'first' });

		// Repeated `keydown` events, then one `keyup`.
		for (let i = 0; i < 20; i++) {
			await page.keyboard.down('Escape');
		}
		await page.keyboard.up('Escape');

		await expect(getLog({ page })).toHaveText('first:escape');
		await expectOpen({ page, name: 'first' });
	});
});

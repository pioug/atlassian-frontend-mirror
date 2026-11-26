import { expect, type Page, test } from '@af/integration-testing';

/**
 * A control that undoes its own state on Escape (for example an inline edit that leaves edit mode)
 * takes the Escape with `preventDefault()`. Then the layer around it stays open: one press undoes one
 * thing, as with native close watchers. See notes/decisions/consumed-escape.md.
 */

type TLayerName = 'dialog' | 'manual';

async function openLayer({ page, name }: { page: Page; name: TLayerName }) {
	await page.visitExample<typeof import('../../examples/180-testing-consumed-escape.tsx')>(
		'design-system',
		'top-layer',
		'testing-consumed-escape',
	);
	await page.getByTestId(`${name}-trigger`).click();
	await expect(page.getByTestId(`${name}-layer`)).toBeVisible();
}

const layers: { name: TLayerName; description: string }[] = [
	{ name: 'dialog', description: 'Dialog' },
	{ name: 'manual', description: 'manual popover with useManualLightDismiss' },
];

for (const { name, description } of layers) {
	test.describe(`Escape in a control inside a ${description}`, () => {
		test('a handler that calls preventDefault() takes the Escape: the layer stays open, and focus stays in the control', async ({
			page,
		}) => {
			await openLayer({ page, name });
			const control = page.getByTestId(`${name}-prevent`);
			await control.focus();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${name}-handler-count`)).toHaveText('1');
			await expect(page.getByTestId(`${name}-layer`)).toBeVisible();
			await expect(page.getByTestId(`${name}-close-count`)).toHaveText('0');
			await expect(control).toBeFocused();

			// The next Escape, from a control that does not take it, closes the layer.
			await page.getByTestId(`${name}-read`).focus();
			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${name}-layer`)).toBeHidden();
			await expect(page.getByTestId(`${name}-close-count`)).toHaveText('1');
		});

		test('a handler that does not call preventDefault() leaves the Escape to the layer, and the layer closes', async ({
			page,
		}) => {
			await openLayer({ page, name });
			await page.getByTestId(`${name}-read`).focus();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${name}-handler-count`)).toHaveText('1');
			await expect(page.getByTestId(`${name}-layer`)).toBeHidden();
			await expect(page.getByTestId(`${name}-close-count`)).toHaveText('1');
		});
	});
}

/**
 * `stopPropagation()` is not a claim. It hides the Escape from the `document` and `window`
 * listeners, so a `Dialog` and a manual popover do not see it. But the browser still makes its close
 * request, so an `auto` popover closes (see `escape-target-selection.spec.tsx`, `stop`). Call
 * `preventDefault()` instead.
 */
test.describe('Escape in a control that calls stopPropagation()', () => {
	for (const { name, description } of layers) {
		test(`the ${description} does not see the Escape`, async ({ page }) => {
			await openLayer({ page, name });
			await page.getByTestId(`${name}-stop`).focus();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${name}-handler-count`)).toHaveText('1');
			await expect(page.getByTestId(`${name}-close-count`)).toHaveText('0');
			await expect(page.getByTestId(`${name}-layer`)).toBeVisible();
		});
	}
});

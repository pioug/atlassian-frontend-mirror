import { expect, type Locator, type Page, test } from '@af/integration-testing';

/**
 * Escape in an inline edit inside a layer. One press undoes one thing, innermost first: a layer
 * open in the edit view, then the edit, then the layer around the inline edit. An inline edit in
 * read view does not take Escape. See `@atlaskit/top-layer` notes/decisions/consumed-escape.md.
 */

const featureFlag = 'platform-dst-top-layer';

type TLayer = 'modal' | 'popup';

async function openLayer({
	page,
	layer,
	isTopLayer,
}: {
	page: Page;
	layer: TLayer;
	isTopLayer: boolean;
}): Promise<Locator> {
	await page.visitExample<
		typeof import('../../../../../examples/15-testing-inline-edit-escape-in-layer.tsx')
	>('design-system', 'inline-edit', 'testing-inline-edit-escape-in-layer', {
		...(isTopLayer ? { featureFlag } : {}),
		'react-18-mode': 'modern',
	});
	await page.getByTestId(`${layer}-trigger`).click();
	const layerElement = page.getByTestId(layer);
	await expect(layerElement).toBeVisible();
	return layerElement;
}

/**
 * Enters edit mode from the keyboard, as the edit button is visually hidden.
 */
async function startEditing({ page, field }: { page: Page; field: string }): Promise<void> {
	await page.getByTestId(`${field}--edit-button`).focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId(`${field}--confirm`)).toBeVisible();
}

for (const layer of ['modal', 'popup'] as const) {
	test.describe(`InlineEdit in a ${layer}, top layer`, () => {
		test('in read view, Escape is not taken: the layer closes', async ({ page }) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: true });
			await page.getByTestId(`${layer}-text--edit-button`).focus();

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
		});

		test('while editing, Escape 1 cancels the edit and the layer stays open, Escape 2 closes the layer', async ({
			page,
		}) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: true });
			await startEditing({ page, field: `${layer}-text` });
			await expect(page.getByRole('textbox', { name: 'Text', exact: true })).toBeFocused();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${layer}-text--confirm`)).toBeHidden();
			await expect(page.getByTestId(`${layer}-text--edit-button`)).toBeFocused();
			await expect(layerElement).toBeVisible();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('0');

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
		});

		test('with a Select menu open, Escape 1 closes the menu, Escape 2 cancels the edit, Escape 3 closes the layer', async ({
			page,
		}) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: true });
			await startEditing({ page, field: `${layer}-select` });
			// The only combobox in the layer while this field is editing.
			const combobox = layerElement.getByRole('combobox');
			await expect(combobox).toBeFocused();
			await page.keyboard.press('ArrowDown');
			const menu = page.getByRole('listbox');
			await expect(menu).toBeVisible();

			await page.keyboard.press('Escape');

			await expect(menu).toBeHidden();
			await expect(page.getByTestId(`${layer}-select--confirm`)).toBeVisible();
			await expect(combobox).toBeFocused();
			await expect(layerElement).toBeVisible();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${layer}-select--confirm`)).toBeHidden();
			await expect(page.getByTestId(`${layer}-select--edit-button`)).toBeFocused();
			await expect(layerElement).toBeVisible();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('0');

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
		});

		test('with a DatePicker calendar open, Escape 1 closes the calendar, Escape 2 cancels the edit, Escape 3 closes the layer', async ({
			page,
		}) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: true });
			// The calendar opens when the edit view takes focus.
			await startEditing({ page, field: `${layer}-date` });
			const calendar = page.getByTestId(`${layer}-date-picker--calendar--calendar`);
			const input = page.getByTestId(`${layer}-date-picker-select--input`);
			await expect(calendar).toBeVisible();
			await expect(input).toBeFocused();

			await page.keyboard.press('Escape');

			await expect(calendar).toBeHidden();
			await expect(page.getByTestId(`${layer}-date--confirm`)).toBeVisible();
			await expect(input).toBeFocused();
			await expect(layerElement).toBeVisible();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${layer}-date--confirm`)).toBeHidden();
			await expect(page.getByTestId(`${layer}-date--edit-button`)).toBeFocused();
			await expect(layerElement).toBeVisible();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('0');

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
		});

		test('an Escape that an inner handler takes keeps the edit and the layer open', async ({
			page,
		}) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: true });
			await startEditing({ page, field: `${layer}-preventing` });
			const textbox = page.getByRole('textbox', { name: 'Text that takes Escape' });
			await expect(textbox).toBeFocused();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId(`${layer}-preventing--confirm`)).toBeVisible();
			await expect(textbox).toBeFocused();
			await expect(layerElement).toBeVisible();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('0');
		});
	});

	// Legacy, as it is: one Escape in an editing inline edit also closes the layer around it.
	test.describe(`InlineEdit in a ${layer}, legacy`, () => {
		test('in read view, Escape closes the layer', async ({ page }) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: false });
			await page.getByTestId(`${layer}-text--edit-button`).focus();

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
			await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
		});

		for (const { field, description, openInnerLayer } of [
			{ field: 'text', description: 'while editing', openInnerLayer: null },
			{
				field: 'select',
				description: 'with a Select menu open',
				openInnerLayer: async ({ page }: { page: Page }) => {
					await page.keyboard.press('ArrowDown');
					await expect(page.getByRole('listbox')).toBeVisible();
				},
			},
			{
				field: 'preventing',
				description: 'after an inner handler takes the Escape',
				openInnerLayer: null,
			},
		]) {
			test(`${description}, Escape 1 cancels the edit and closes the layer`, async ({ page }) => {
				const layerElement = await openLayer({ page, layer, isTopLayer: false });
				await startEditing({ page, field: `${layer}-${field}` });
				await openInnerLayer?.({ page });

				await page.keyboard.press('Escape');

				await expect(layerElement).toBeHidden();
				await expect(page.getByTestId(`${layer}-close-count`)).toHaveText('1');
			});
		}

		// Escape 1 closes the layer too in Chromium, but not in Firefox. So the layer is checked
		// after Escape 2, which closes it in Firefox and does nothing in Chromium.
		test('with a DatePicker calendar open, Escape 1 closes the calendar and cancels the edit, and the layer is closed by Escape 2', async ({
			page,
		}) => {
			const layerElement = await openLayer({ page, layer, isTopLayer: false });
			await startEditing({ page, field: `${layer}-date` });
			const calendar = page.getByTestId(`${layer}-date-picker--calendar--calendar`);
			await expect(calendar).toBeVisible();

			await page.keyboard.press('Escape');

			await expect(calendar).toBeHidden();
			await expect(page.getByTestId(`${layer}-date--confirm`)).toBeHidden();

			await page.keyboard.press('Escape');

			await expect(layerElement).toBeHidden();
		});
	});
}

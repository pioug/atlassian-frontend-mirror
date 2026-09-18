/* eslint-disable testing-library/prefer-screen-queries */

import { expect, test } from '@af/integration-testing';

test.describe('Surface pointer events reset', () => {
	test('popover content remains interactive inside a pointer-events none controls layer', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/157-testing-pointer-events-reset.tsx')>(
			'design-system',
			'top-layer',
			'testing-pointer-events-reset',
		);

		await page.getByRole('button', { name: 'More actions' }).click();
		const action = page.getByTestId('popover-action');
		await expect(action).toBeVisible();

		await action.click();

		await expect(page.getByText('Action selected 1 times')).toBeVisible();
		await expect(page.getByTestId('popover-card-surface')).toContainText('Card opened 0 times');
	});

	test('dialog content remains interactive inside a pointer-events none controls layer', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/157-testing-pointer-events-reset.tsx')>(
			'design-system',
			'top-layer',
			'testing-pointer-events-reset',
		);

		await page.getByRole('button', { name: 'Open details' }).click();
		const action = page.getByTestId('dialog-action');
		await expect(action).toBeVisible();

		await action.click();

		await expect(page.getByText('Action selected 1 times')).toBeVisible();
		await expect(page.getByTestId('dialog-card-surface')).toContainText('Card opened 0 times');
	});
});

import { nestedExpandInExpandADF } from '../__fixtures__/nested-expand-adf';
import { rendererTestCase as test, expect } from './not-libra';

test.describe('expand', () => {
	test.describe('default mode', () => {
		test.use({
			adf: nestedExpandInExpandADF('default'),
		});

		test('should render as closed by default', async ({ renderer }) => {
			const expand = renderer.page.locator(
				'[data-testid="expand-container-expand-expand-title-1"] > button',
			);
			const nestedExpand = renderer.page.locator(
				'[data-testid="expand-container-nestedExpand-expand-title-2"] > button',
			);

			await expect(expand).toHaveAttribute('aria-expanded', 'false');
			await expect(nestedExpand).toHaveAttribute('aria-expanded', 'false');
		});

		test('should only expand and collapse the parent expand on toggle', async ({ renderer }) => {
			const expand = renderer.page.locator(
				'[data-testid="expand-container-expand-expand-title-1"] > button',
			);
			const nestedExpand = renderer.page.locator(
				'[data-testid="expand-container-nestedExpand-expand-title-2"] > button',
			);

			// toggle expand open, nested expand remains closed
			await expand.waitFor({ state: 'visible' });
			await expand.click();

			await expect(expand).toHaveAttribute('aria-expanded', 'true');
			await expect(nestedExpand).toHaveAttribute('aria-expanded', 'false');

			// toggle expand closed, nested expand remains closed
			await expand.waitFor({ state: 'visible' });
			await expand.click();

			await expect(expand).toHaveAttribute('aria-expanded', 'false');
			await expect(nestedExpand).toHaveAttribute('aria-expanded', 'false');
		});

		test('should only expand and collapse the nested expand on toggle', async ({ renderer }) => {
			const expand = renderer.page.locator(
				'[data-testid="expand-container-expand-expand-title-1"] > button',
			);
			const nestedExpand = renderer.page.locator(
				'[data-testid="expand-container-nestedExpand-expand-title-2"] > button',
			);

			// expand is closed by default so nestedExpand is not visible
			await expand.waitFor({ state: 'visible' });
			await expand.click();

			// toggle nested expand open, parent expand remains open
			await nestedExpand.waitFor({ state: 'visible' });
			await nestedExpand.click();

			await expect(expand).toHaveAttribute('aria-expanded', 'true');
			await expect(nestedExpand).toHaveAttribute('aria-expanded', 'true');

			// toggle nested expand closed, parent expand remains open
			await nestedExpand.waitFor({ state: 'visible' });
			await nestedExpand.click();

			await expect(expand).toHaveAttribute('aria-expanded', 'true');
			await expect(nestedExpand).toHaveAttribute('aria-expanded', 'false');
		});
	});
});

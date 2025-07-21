import { rendererTestCase as test, expect } from './not-libra';
import { adf } from './datasource.spec.ts-fixtures';

const DATASOURCE_TABLE_VIEW = '[data-testid="datasource-table-view"]';

test.describe('datasource', () => {
	test.use({
		adf,
		rendererMountOptions: {
			withRendererActions: true,
		},
	});
	test(`Can see a rendered datasource table`, async ({ renderer }) => {
		const locator = renderer.page.locator(DATASOURCE_TABLE_VIEW);

		await expect(locator).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		const locator = renderer.page.locator(DATASOURCE_TABLE_VIEW);
		await expect(locator).toBeVisible();

		await expect(renderer.page).toBeAccessible({ violationCount: 2 });
	});
});

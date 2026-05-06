import { skipAutoA11y } from '@atlassian/a11y-playwright-testing';
import { adf } from './datasource.spec.ts-fixtures';
import { rendererTestCase as test, expect } from './not-libra';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
const DATASOURCE_TABLE_VIEW = '[data-testid=\"datasource-table-view\"]';

test.describe('datasource', () => {
	test.use({
		adf,
		rendererMountOptions: {
			withRendererActions: true,
		},
	});
	test(`Can see a rendered datasource table`, async ({ renderer }) => {
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		const locator = renderer.page.locator(DATASOURCE_TABLE_VIEW);

		await expect(locator).toBeVisible();
	});

	test('should capture and report a11y violations', async ({ renderer }) => {
		// This test exposes one or more accessibility violations. Testing is currently skipped but violations need to
		// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
		// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
		skipAutoA11y();
		const locator = renderer.page.locator(DATASOURCE_TABLE_VIEW);
		await expect(locator).toBeVisible();

		await expect(renderer.page).toBeAccessible({ violationCount: 1 });
	});
});

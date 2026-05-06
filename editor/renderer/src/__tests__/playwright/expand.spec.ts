import { skipAutoA11yFile } from '@atlassian/a11y-playwright-testing';
import { expandADF } from '../__fixtures__/expand-adf';
import { rendererTestCase as test, expect } from './not-libra';

test.use({ exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx') });
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:playwright
skipAutoA11yFile();

test.describe('expand', () => {
	test.describe('default mode', () => {
		test.use({
			adf: expandADF('default'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');
			await expander.waitFor({ state: 'visible' });
			await expander.click();
			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			await expect(renderer.page).toBeAccessible({ violationCount: 2 });
		});
	});
	test.describe('wide mode', () => {
		test.use({
			adf: expandADF('wide'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});
	});
	test.describe('full-width mode', () => {
		test.use({
			adf: expandADF('full-width'),
		});

		test('should expand a collapsed nested expand on toggle', async ({ renderer }) => {
			const expander = renderer.page.locator('[data-node-type="expand"] > button');

			await expander.waitFor({ state: 'visible' });
			await expander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeHidden();

			const nestedExpander = renderer.page.locator('[data-node-type="nestedExpand"] > button');
			await nestedExpander.waitFor({ state: 'visible' });
			await nestedExpander.click();

			await expect(
				renderer.page.locator('[data-testid="expand-container-nestedExpand-expand-title-2"] > div'),
			).toBeVisible();
		});
	});
});

import { AxeBuilder } from '@axe-core/playwright';

import { expect, test } from '@af/integration-testing';

test.describe('theming', () => {
	test('it produces sufficient color contrast', async ({ page, skipAxeCheck }) => {
		/**
		 * This check is not useful here.
		 *
		 * The example has accessibility issues, but only because we are rendering
		 * multiple top bars in a single page. That is not a scenario that will actually occur.
		 */
		skipAxeCheck();

		await page.visitExample('design-system', 'navigation-system', 'top-navigation-theming');

		const result = await new AxeBuilder({ page }).withRules('color-contrast').analyze();

		expect(result.violations).toEqual([]);
	});
});

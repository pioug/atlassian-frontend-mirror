/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('TTAI: timers', () => {
	test.use({
		examplePage: 'ttai-with-timers',
	});

	test.describe('when there is nested setTimeout simulating a clock behavior', () => {
		test('it should mark the TTAI as soon as the first nested timer function dispatches', async ({
			page,
			getSectionVisibleAt,
		}) => {
			const divWithTTAI = page.locator('[data-is-ttai-ready="true"]');

			await getSectionVisibleAt('sectionNine');

			await expect(divWithTTAI).toBeVisible();
		});
	});
});

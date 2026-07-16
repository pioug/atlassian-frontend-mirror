/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

import {
	focusInteractionScenarios,
	MOUSE_FOCUS_WEBKIT_FIXME_REASON,
} from './focus-interaction-scenarios';

/**
 * Focus-restoration smoke test (WCAG 2.4.3). Generated for both modalities; the
 * mouse variant is skipped on WebKit (see focus-interaction-scenarios). See also
 * notes/architecture/focus.md and
 * notes/decisions/safari-escape-nested-popover-in-dialog.md.
 */
test.describe('Dialog - focus restoration', () => {
	for (const scenario of focusInteractionScenarios) {
		test(`dialog restores focus to the trigger on Escape (${scenario.method})`, async ({
			page,
			browserName,
		}) => {
			test.fixme(
				scenario.skipFocusRestorationOnWebKit && browserName === 'webkit',
				MOUSE_FOCUS_WEBKIT_FIXME_REASON,
			);
			await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
				'design-system',
				'top-layer',
				'testing-popup-focus-restore',
			);

			const trigger = page.getByTestId('dialog-trigger');
			await scenario.activate({ page, trigger });
			await expect(page.getByTestId('dialog-popup')).toBeVisible();

			// Escape returns focus to the trigger.
			await page.keyboard.press('Escape');
			await expect(page.getByTestId('dialog-popup')).toBeHidden();
			await expect(trigger).toBeFocused();
		});
	}
});

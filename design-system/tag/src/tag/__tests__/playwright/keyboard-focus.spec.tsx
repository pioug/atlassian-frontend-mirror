import { expect, test } from '@af/integration-testing';

for (const enabled of [false, true]) {
	for (const { reducedMotion, enteringOverflow } of [
		{ reducedMotion: 'no-preference', enteringOverflow: 'hidden' },
		{ reducedMotion: 'reduce', enteringOverflow: undefined },
	] as const) {
		test(`uses M2 ${enabled} for linked tag focus with ${reducedMotion} motion`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion });
			await page.visitExample<typeof import('../../../../examples/keyboard-focus.tsx')>(
				'design-system',
				'tag',
				'keyboard-focus',
				{
					featureFlag: 'platform-dst-motion-uplift-labels',
					platformExperimentOverrides: JSON.stringify({
						prefetch_nin_resources_on_user_intent_m2: { isEnabled: enabled },
					}),
				},
			);
			const link = page.getByRole('link', { name: 'Prefetch QA component', exact: true });
			await expect(link.locator('../..')).toHaveCSS('animation-name', 'none');
			await expect(link.locator('../..')).toHaveCSS('overflow', enabled ? 'visible' : 'hidden');
			await page.getByRole('button', { name: 'Start keyboard navigation', exact: true }).focus();
			await page.keyboard.press('Tab');
			await expect(link).toBeFocused();
			await expect(link.locator('..')).toHaveCSS('outline-style', 'solid');
			await expect
				.poll(() =>
					link.evaluate(
						(element) =>
							element
								.closest('[data-tag-entering-overflow]')
								?.getAttribute('data-tag-entering-overflow') ?? undefined,
					),
				)
				.toBe(enteringOverflow);
			await expect(link.locator('../..')).toHaveCSS('overflow', enabled ? 'visible' : 'hidden');

			const trigger = page.getByRole('button', { name: 'Show more components', exact: true });
			await page.keyboard.press('Tab');
			await expect(trigger).toBeFocused();
			await page.keyboard.press('Enter');
			const popupLink = page.getByRole('link', { name: 'Second component', exact: true });
			await expect(popupLink).toBeVisible();
			await page.keyboard.press('Tab');
			await expect(popupLink).toBeFocused();
			await expect(popupLink.locator('..')).toHaveCSS('outline-style', 'solid');
			await expect(popupLink.locator('../..')).toHaveCSS(
				'overflow',
				enabled ? 'visible' : 'hidden',
			);
			await page.keyboard.press('Escape');
			await expect(trigger).toBeFocused();
		});
	}
}

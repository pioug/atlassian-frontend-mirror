import { expect, test } from '@af/integration-testing';

const mobileViewport = { width: 360, height: 800 };

test('mobile overflow keyboard navigation', async ({ page }) => {
	await page.setViewportSize(mobileViewport);
	await page.visitExample<typeof import('../../../examples/side-nav-layering.vr.ap.tsx')>(
		'design-system',
		'navigation-system',
		'side-nav-layering',
		{
			featureFlag: [
				'platform-dst-chat-panel-layout',
				// Matches Popup's own nested Escape tests for the legacy focus trap.
				'platform_dst_nested_escape',
				// Legacy focus trap; the top-layer version is below.
				'platform-dst-top-layer=false',
			].join(','),
		},
	);

	const overflowTrigger = page.getByRole('button', { name: 'Show more', exact: true });
	const overflow = page.getByRole('dialog', { name: 'Actions', exact: true });
	const firstAction = page.getByRole('button', { name: 'Help', exact: true });
	const nestedTrigger = page.getByRole('button', { name: 'Profile', exact: true });

	await overflowTrigger.focus();
	await page.keyboard.press('Enter');
	await expect(overflow).toBeVisible();
	await expect(overflow).toBeFocused();

	// Both boundaries wrap inside the overflow dialog.
	await page.keyboard.press('Shift+Tab');
	await expect(nestedTrigger).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(firstAction).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await expect(nestedTrigger).toBeFocused();
	await page.keyboard.press('Enter');
	const nestedAction = page.getByRole('menuitem', { name: 'Account', exact: true });
	await expect(nestedAction).toBeVisible();
	await expect(nestedAction).toBeFocused();

	// Escape dismisses only the inner layer and restores its trigger.
	await page.keyboard.press('Escape');
	await expect(nestedAction).toBeHidden();
	await expect(overflow).toBeVisible();
	await expect(nestedTrigger).toBeFocused();

	// A second Escape dismisses the overflow and restores Show more.
	await page.keyboard.press('Escape');
	await expect(overflow).toBeHidden();
	await expect(overflowTrigger).toBeFocused();
});

test('mobile overflow keyboard navigation (top layer)', async ({ page, browserName }) => {
	test.fixme(browserName === 'webkit', 'WebKit: the second Escape often leaves the overflow open.');
	await page.setViewportSize(mobileViewport);
	await page.visitExample<typeof import('../../../examples/side-nav-layering.vr.ap.tsx')>(
		'design-system',
		'navigation-system',
		'side-nav-layering',
		{ featureFlag: 'platform-dst-chat-panel-layout,platform-dst-top-layer' },
	);

	const overflowTrigger = page.getByRole('button', { name: 'Show more', exact: true });
	const overflow = page.getByRole('dialog', { name: 'Actions', exact: true });
	const firstAction = page.getByRole('button', { name: 'Help', exact: true });
	const nestedTrigger = page.getByRole('button', { name: 'Profile', exact: true });

	await overflowTrigger.focus();
	await page.keyboard.press('Enter');
	await expect(overflow).toBeVisible();
	// A top-layer dialog moves initial focus to its first focusable element.
	await expect(firstAction).toBeFocused();

	// Both boundaries wrap inside the overflow dialog.
	await page.keyboard.press('Shift+Tab');
	await expect(nestedTrigger).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(firstAction).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await expect(nestedTrigger).toBeFocused();
	await page.keyboard.press('Enter');
	const nestedAction = page.getByRole('menuitem', { name: 'Account', exact: true });
	await expect(nestedAction).toBeVisible();
	await expect(nestedAction).toBeFocused();

	// Escape dismisses only the inner layer and restores its trigger.
	await page.keyboard.press('Escape');
	await expect(nestedAction).toBeHidden();
	await expect(overflow).toBeVisible();
	await expect(nestedTrigger).toBeFocused();

	// A second Escape dismisses the overflow and restores Show more.
	await page.keyboard.press('Escape');
	await expect(overflow).toBeHidden();
	await expect(overflowTrigger).toBeFocused();
});

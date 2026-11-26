import { expect, type Page, test } from '@af/integration-testing';

// TODO(top-layer): with `platform-dst-motion-uplift-popup` on (production), legacy Popup puts its
// focus trap on the motion container, which cannot take focus, so focus does not move into the popup
// on open. The top layer should fix this.
const legacyOpenFocusLost = 'Legacy Popup does not move focus into itself on open';

for (const topLayer of [false, true]) {
	test(`keeps overflow open when only the viewport crosses its breakpoint (top layer: ${topLayer})`, async ({
		page,
	}) => {
		test.fixme(!topLayer, legacyOpenFocusLost);
		const { header, overflow, resize } = await setupComponent(page, topLayer);
		await resize(500);
		await page.setViewportSize({ width: 800, height: 900 });
		await overflow.click();
		await waitForPopupFocus(page, 'Actions');
		const popup = page.getByRole('dialog', { name: 'Actions', exact: true });
		for (const width of [700, 800]) {
			await page.setViewportSize({ width, height: 900 });
			await expect(header).toHaveWidth(500);
			await expect(overflow).toHaveAttribute('aria-expanded', 'true');
			await expect(popup).toBeVisible();
		}
		// A real container breakpoint change must still close the old popup.
		await resize(800);
		await expect(popup).toHaveCount(0);
		await expect(overflow).toHaveCount(0);
		await resize(500);
		await expect(overflow).toHaveAttribute('aria-expanded', 'false');
	});

	test(`keeps initial overflow focus on expansion (top layer: ${topLayer})`, async ({ page }) => {
		test.fixme(!topLayer, legacyOpenFocusLost);
		const { header, overflow, resize } = await setupComponent(page, topLayer);
		await resize(767);
		await overflow.focus();
		await page.keyboard.press('Enter');
		const popup = page.getByRole('dialog', { name: 'Actions', exact: true });
		// Leave focus exactly where Popup puts it; legacy Popup focuses its outer container.
		await expect
			.poll(() => popup.evaluate((element) => element.contains(document.activeElement)))
			.toBe(true);
		await resize(800);
		await expect(overflow).toHaveCount(0);
		await expect(
			header.getByRole('navigation', { name: 'Actions', exact: true }).getByRole('button').first(),
		).toBeFocused();
	});

	test(`keeps focus from nested action popups across resizing (top layer: ${topLayer})`, async ({
		page,
	}) => {
		test.fixme(!topLayer, legacyOpenFocusLost);
		const { header, settings, overflow, resize } = await setupComponent(page, topLayer);
		await settings.focus();
		await page.keyboard.press('Enter');
		const nestedAction = page.getByRole('button', { name: 'Manage settings', exact: true });
		await waitForPopupFocus(page, 'Settings options');
		await nestedAction.focus();
		await resize(767);
		await expect(nestedAction).toHaveCount(0);
		await expect(overflow).toBeFocused();
		await page.keyboard.press('Enter');
		await waitForPopupFocus(page, 'Actions');
		await settings.focus();
		await page.keyboard.press('Enter');
		await waitForPopupFocus(page, 'Settings options');
		await nestedAction.focus();
		await resize(800);
		await expect(overflow).toHaveCount(0);
		await expect(settings).toBeFocused();
		await page.keyboard.press('Enter');
		await waitForPopupFocus(page, 'Settings options');
		await nestedAction.focus();
		const appSwitcher = header.getByRole('button', { name: 'Switch apps', exact: true });
		await appSwitcher.click();
		await expect(appSwitcher).toBeFocused();
		await resize(767);
		await expect(overflow).toBeVisible();
		await expect(appSwitcher).toBeFocused();
	});

	test(`keeps focus in the actions when crossing the container breakpoint (top layer: ${topLayer})`, async ({
		page,
	}) => {
		test.fixme(!topLayer, legacyOpenFocusLost);
		const { header, settings, overflow, resize } = await setupComponent(page, topLayer);
		await settings.focus();
		await resize(767);
		await expect(overflow).toBeFocused();
		await resize(800);
		// Wait for React to replace the popup; CSS width changes before that commit.
		await expect(overflow).toHaveCount(0);
		await expect(settings).toBeFocused();
		await resize(767);
		await overflow.click();
		await waitForPopupFocus(page, 'Actions');
		await settings.focus();
		await resize(800);
		// Wait for React to replace the popup; CSS width changes before that commit.
		await expect(overflow).toHaveCount(0);
		await expect(settings).toBeFocused();
		// Moving away before the breakpoint changes must cancel restoration.
		const search = header.getByRole('button', {
			name: 'Seiten, Bereiche und Personen durchsuchen',
			exact: true,
		});
		await search.focus();
		await expect(search).toBeFocused();
		await resize(767);
		await expect(search).toBeFocused();
		await overflow.focus();
		await search.focus();
		await expect(search).toBeFocused();
		await resize(800);
		// Wait for React to replace the popup; CSS width changes before that commit.
		await expect(overflow).toHaveCount(0);
		await expect(search).toBeFocused();
		// Explicitly blurring a visible action must not leave a stale request.
		await settings.focus();
		await settings.evaluate((element) => element.blur());
		await resize(767);
		await expect(overflow).toBeVisible();
		await expect(overflow).not.toBeFocused();
	});
}

async function waitForPopupFocus(page: Page, label: string) {
	// Legacy Popup schedules its initial focus. Wait for it before directing focus
	// to a nested trigger, otherwise that scheduled focus can intercept Enter.
	const popup = page.getByRole('dialog', { name: label, exact: true });
	await expect
		.poll(() => popup.evaluate((element) => element.contains(document.activeElement)))
		.toBe(true);
}

async function setupComponent(page: Page, topLayer: boolean) {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
		'design-system',
		'navigation-system',
		'top-nav-container-ssr',
		{
			featureFlag: [
				'platform-dst-chat-panel-layout',
				...(topLayer ? ['platform-dst-top-layer'] : []),
			].join(','),
		},
	);
	const header = page.getByTestId('container-top-nav');
	const resize = async (width: number) => {
		await header.evaluate((element, value) => {
			element.style.width = `${value}px`;
		}, width);
		await expect(header).toHaveWidth(width);
	};
	await resize(800);
	await page.getByRole('button', { name: 'Hydrate navigation' }).click();
	await expect(page.getByRole('button', { name: 'Hydrate navigation' })).toBeDisabled();
	const settings = header.getByRole('button', { name: 'Settings', exact: true });
	const overflow = header.getByRole('button', { name: 'Show more', exact: true });
	return { header, settings, overflow, resize };
}

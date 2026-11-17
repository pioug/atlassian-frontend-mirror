import { expect, test } from '@af/integration-testing';

test('expanded desktop side nav reserves space when mobile motion CSS loads last', async ({
	page,
	browserName,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.visitExample<typeof import('../../../examples/menu-item-integration.tsx')>(
		'design-system',
		'navigation-system',
		'menu-item-integration',
		{ featureFlag: 'platform-dst-motion-uplift-sidenav' },
	);

	const sideNav = page.getByRole('navigation', { name: 'Side navigation', exact: true });
	const main = page.getByRole('main');
	await page.getByRole('button', { name: 'Collapse sidebar', exact: true }).click();
	await expect(sideNav).toBeHidden();
	await page.getByRole('button', { name: 'Expand sidebar', exact: true }).click();
	await expect(sideNav).toHaveCSS('grid-area', 'side-nav');

	// Mobile visibility remains collapsed while desktop visibility is expanded. Reinsert the
	// matching mobile rules last to reproduce CSS arriving in a different order during streaming
	// or development. They must not compete with the desktop rules for animation or grid-area.
	const mobileRules = await sideNav.evaluate((nav) => {
		const rules: string[] = [];
		for (const sheet of Array.from(document.styleSheets)) {
			for (const rule of Array.from(sheet.cssRules)) {
				if (
					rule instanceof CSSMediaRule &&
					rule.conditionText.includes('prefers-reduced-motion') &&
					!rule.conditionText.includes('min-width: 64rem') &&
					Array.from(rule.cssRules).some(
						(child) =>
							child instanceof CSSStyleRule &&
							nav.matches(child.selectorText) &&
							child.style.gridArea === 'main',
					)
				) {
					rules.push(rule.cssText);
				}
			}
		}
		return rules;
	});
	// Firefox deliberately disables side-nav motion, so it only exercises the static layout.
	const minimumMatchingRules = { chromium: 1, webkit: 1, firefox: 0 };
	expect(mobileRules.length).toBeGreaterThanOrEqual(minimumMatchingRules[browserName]);
	// eslint-disable-next-line playwright/no-conditional-in-test -- Firefox has no motion rules to reinsert; all layout assertions still run.
	if (mobileRules.length > 0) {
		await page.addStyleTag({ content: mobileRules.join('\n') });
	}
	// A discrete grid transition keeps the previous area briefly, so let it settle before checking.
	await sideNav.evaluate(async (nav) => {
		await Promise.all(nav.getAnimations().map((animation) => animation.finished.catch(() => {})));
	});
	await expect(sideNav).toHaveCSS('grid-area', 'side-nav');
	await expect
		.poll(async () => {
			const navBounds = await sideNav.boundingBox();
			const mainBounds = await main.boundingBox();
			return navBounds && mainBounds && mainBounds.x >= navBounds.x + navBounds.width - 1;
		})
		.toBe(true);
});

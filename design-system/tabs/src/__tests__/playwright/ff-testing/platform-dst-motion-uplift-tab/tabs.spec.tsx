import { expect, type Locator, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-motion-uplift-tab';
const practicalOut = 'cubic-bezier(0.4, 1, 0.6, 1)';
const slowTabTransition = `color 2s ${practicalOut}, opacity 2s ${practicalOut}`;
const slowIndicatorMotion =
	'[data-motion-state="entering"]::after, [data-motion-state="exiting"]::after { animation-duration: 5s !important; }';

const getPseudoElementStyles = (tab: Locator, pseudoElement: '::before' | '::after') =>
	tab.evaluate((element, pseudoElement) => {
		const styles = window.getComputedStyle(element, pseudoElement);
		return {
			animationDuration: styles.animationDuration,
			animationName: styles.animationName,
			borderBlockEndColor: styles.borderBlockEndColor,
			borderBlockEndStyle: styles.borderBlockEndStyle,
			borderBlockEndWidth: styles.borderBlockEndWidth,
			content: styles.content,
			motionTab: styles.getPropertyValue('--ds-tab').trim(),
			opacity: styles.opacity,
			transitionDuration: styles.transitionDuration,
			transitionProperty: styles.transitionProperty,
			transitionTimingFunction: styles.transitionTimingFunction,
			zIndex: styles.zIndex,
		};
	}, pseudoElement);

test('preserves click and keyboard selection with root-owned directional motion', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);

	const firstTab = page.getByTestId('tab-1');
	const secondTab = page.getByTestId('tab-2');
	const thirdTab = page.getByTestId('tab-3');

	await expect(firstTab).toHaveAttribute('data-motion-capable', 'true');
	await expect(firstTab).toHaveAttribute('data-motion-state', 'visible');
	await expect(firstTab).toHaveAttribute('data-motion-direction', 'right');
	const initialIndicator = await getPseudoElementStyles(firstTab, '::after');
	expect(initialIndicator.borderBlockEndStyle).toBe('solid');
	expect(initialIndicator.borderBlockEndWidth).toBe('2px');
	expect(initialIndicator.opacity).toBe('1');
	expect(initialIndicator.zIndex).toBe('1');

	await page.addStyleTag({ content: slowIndicatorMotion });
	await thirdTab.click();
	await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
	await expect(page.getByTestId('tab-panel-3')).toBeVisible();
	await expect(firstTab).toHaveAttribute('data-motion-state', 'exiting');
	await expect(firstTab).toHaveAttribute('data-motion-direction', 'right');
	await expect(thirdTab).toHaveAttribute('data-motion-state', 'entering');
	await expect(thirdTab).toHaveAttribute('data-motion-direction', 'right');

	const rightExitIndicator = await getPseudoElementStyles(firstTab, '::after');
	const rightEnterIndicator = await getPseudoElementStyles(thirdTab, '::after');
	expect(rightExitIndicator.animationName).toContain('SlideOutRight8px');
	expect(rightExitIndicator.animationName).toContain('FadeOut100to0');
	expect(rightEnterIndicator.animationName).toContain('SlideInRight8px');
	expect(rightEnterIndicator.animationName).toContain('FadeIn0to100');

	await page.keyboard.press('ArrowLeft');
	await expect(secondTab).toBeFocused();
	await expect(secondTab).toHaveAttribute('aria-selected', 'true');
	await expect(page.getByTestId('tab-panel-2')).toBeVisible();
	await expect(firstTab).toHaveAttribute('data-motion-state', 'exiting');
	await expect(firstTab).toHaveAttribute('data-motion-direction', 'right');
	await expect(thirdTab).toHaveAttribute('data-motion-state', 'exiting');
	await expect(thirdTab).toHaveAttribute('data-motion-direction', 'left');
	await expect(secondTab).toHaveAttribute('data-motion-state', 'entering');
	await expect(secondTab).toHaveAttribute('data-motion-direction', 'left');

	const leftExitIndicator = await getPseudoElementStyles(thirdTab, '::after');
	const leftEnterIndicator = await getPseudoElementStyles(secondTab, '::after');
	expect(leftExitIndicator.animationName).toContain('SlideOutLeft8px');
	expect(leftExitIndicator.animationName).toContain('FadeOut100to0');
	expect(leftEnterIndicator.animationName).toContain('SlideInLeft8px');
	expect(leftEnterIndicator.animationName).toContain('FadeIn0to100');
});

test('applies root-owned directional motion to the exact Constellation custom tab', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ 'custom-tabs': true, featureFlag, 'react-18-mode': 'modern' },
	);

	const firstTab = page.getByRole('tab', { name: 'Tab 1' });
	const thirdTab = page.getByRole('tab', { name: 'Tab 3' });

	await expect(firstTab).toHaveAttribute('data-motion-capable', 'true');
	await expect(firstTab).toHaveAttribute('data-motion-state', 'visible');
	expect(await firstTab.evaluate((element) => element.children.length)).toBe(0);

	await page.addStyleTag({ content: slowIndicatorMotion });
	await thirdTab.click();
	await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
	await expect(page.getByText('This is the content area of the third tab.')).toBeVisible();
	await expect(firstTab).toHaveAttribute('data-motion-state', 'exiting');
	await expect(firstTab).toHaveAttribute('data-motion-direction', 'right');
	await expect(thirdTab).toHaveAttribute('data-motion-state', 'entering');
	await expect(thirdTab).toHaveAttribute('data-motion-direction', 'right');

	const exitingIndicator = await getPseudoElementStyles(firstTab, '::after');
	const enteringIndicator = await getPseudoElementStyles(thirdTab, '::after');
	expect(exitingIndicator.animationDuration).toContain('5s');
	expect(exitingIndicator.animationName).toContain('SlideOutRight8px');
	expect(exitingIndicator.animationName).toContain('FadeOut100to0');
	expect(enteringIndicator.animationDuration).toContain('5s');
	expect(enteringIndicator.animationName).toContain('SlideInRight8px');
	expect(enteringIndicator.animationName).toContain('FadeIn0to100');
});

test('maps directional indicator motion to physical directions in RTL', async ({ page }) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);
	await page.evaluate(() => {
		document.documentElement.dir = 'rtl';
	});

	const firstTab = page.getByTestId('tab-1');
	const secondTab = page.getByTestId('tab-2');
	const thirdTab = page.getByTestId('tab-3');

	await page.addStyleTag({ content: slowIndicatorMotion });
	await thirdTab.click();
	const leftExitIndicator = await getPseudoElementStyles(firstTab, '::after');
	const leftEnterIndicator = await getPseudoElementStyles(thirdTab, '::after');
	expect(leftExitIndicator.animationName).toContain('SlideOutLeft8px');
	expect(leftEnterIndicator.animationName).toContain('SlideInLeft8px');

	await secondTab.click();
	const rightExitIndicator = await getPseudoElementStyles(thirdTab, '::after');
	const rightEnterIndicator = await getPseudoElementStyles(secondTab, '::after');
	expect(rightExitIndicator.animationName).toContain('SlideOutRight8px');
	expect(rightEnterIndicator.animationName).toContain('SlideInRight8px');
});

test('preserves the exact Constellation custom tab legacy path when the gate is off', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ 'custom-tabs': true, 'react-18-mode': 'modern' },
	);

	const firstTab = page.getByRole('tab', { name: 'Tab 1' });
	const thirdTab = page.getByRole('tab', { name: 'Tab 3' });

	expect(await firstTab.evaluate((element) => element.children.length)).toBe(0);
	await expect(firstTab).not.toHaveAttribute('data-motion-capable');
	await expect(firstTab).not.toHaveAttribute('data-motion-state');
	await expect(firstTab).not.toHaveAttribute('data-motion-direction');
	await thirdTab.click();
	await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
	await expect(page.getByText('This is the content area of the third tab.')).toBeVisible();
	await expect(thirdTab).not.toHaveAttribute('data-motion-capable');
	expect((await getPseudoElementStyles(thirdTab, '::after')).animationName).toBe('none');
});

test('keeps the neutral underline visible while an unselected tab is pressed', async ({ page }) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);

	const tab = page.getByTestId('tab-2');
	await expect
		.poll(async () => {
			const [tabMotion, underlineMotion] = await Promise.all([
				tab.evaluate((element) =>
					window.getComputedStyle(element).getPropertyValue('--ds-tab').trim(),
				),
				getPseudoElementStyles(tab, '::before').then((styles) => styles.motionTab),
			]);
			return tabMotion.length > 0 && underlineMotion.length > 0;
		})
		.toBe(true);

	const idleUnderline = await getPseudoElementStyles(tab, '::before');
	const tabMotion = await tab.evaluate((element) =>
		window.getComputedStyle(element).getPropertyValue('--ds-tab').trim(),
	);
	for (const resolvedMotion of [tabMotion, idleUnderline.motionTab]) {
		expect(resolvedMotion).toContain(`color 150ms ${practicalOut}`);
		expect(resolvedMotion).toContain(`opacity 150ms ${practicalOut}`);
	}
	expect(idleUnderline.transitionProperty).toBe('color, opacity');
	expect(idleUnderline.transitionDuration).toBe('0.15s, 0.15s');
	expect(idleUnderline.transitionTimingFunction).toBe(
		'cubic-bezier(0.4, 1, 0.6, 1), cubic-bezier(0.4, 1, 0.6, 1)',
	);
	expect(idleUnderline.opacity).toBe('0');

	await tab.evaluate((element, transition) => {
		(element as HTMLElement).style.setProperty('--ds-tab', transition);
	}, slowTabTransition);
	const slowUnderline = await getPseudoElementStyles(tab, '::before');
	expect(slowUnderline.transitionProperty).toBe('color, opacity');
	expect(slowUnderline.transitionDuration).toBe('2s, 2s');
	expect(slowUnderline.transitionTimingFunction).toBe(
		'cubic-bezier(0.4, 1, 0.6, 1), cubic-bezier(0.4, 1, 0.6, 1)',
	);
	expect(slowUnderline.transitionDuration).not.toBe(idleUnderline.transitionDuration);

	await tab.hover();
	await expect
		.poll(async () => {
			const opacity = Number((await getPseudoElementStyles(tab, '::before')).opacity);
			return opacity > 0 && opacity < 1;
		})
		.toBe(true);
	const intermediateOpacity = Number((await getPseudoElementStyles(tab, '::before')).opacity);
	expect(intermediateOpacity).toBeGreaterThan(0);
	expect(intermediateOpacity).toBeLessThan(1);
	await expect
		.poll(() => getPseudoElementStyles(tab, '::before').then((styles) => styles.opacity))
		.toBe('1');

	const hoveredTextColor = await tab.evaluate((element) => window.getComputedStyle(element).color);
	const hoveredUnderline = await getPseudoElementStyles(tab, '::before');
	const hoveredIndicator = await getPseudoElementStyles(tab, '::after');

	expect(hoveredUnderline.borderBlockEndStyle).toBe('solid');
	expect(hoveredUnderline.borderBlockEndWidth).toBe('2px');
	expect(hoveredIndicator.content).toBe('none');
	const pressedUnderline = {
		borderBlockEndColor: hoveredUnderline.borderBlockEndColor,
		borderBlockEndWidth: hoveredUnderline.borderBlockEndWidth,
		opacity: '1',
	};

	await page.mouse.down();
	await expect(tab).toHaveAttribute('aria-selected', 'false');
	await expect
		.poll(() => tab.evaluate((element) => window.getComputedStyle(element).color))
		.not.toBe(hoveredTextColor);
	await expect
		.poll(async () => {
			const styles = await getPseudoElementStyles(tab, '::before');
			return {
				borderBlockEndColor: styles.borderBlockEndColor,
				borderBlockEndWidth: styles.borderBlockEndWidth,
				opacity: styles.opacity,
			};
		})
		.toEqual(pressedUnderline);
	await page.mouse.up();
});

test('layers the entering indicator over the neutral underline while the previous indicator exits', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);

	const previousTab = page.getByTestId('tab-1');
	const nextTab = page.getByTestId('tab-3');
	await expect(previousTab).toHaveAttribute('data-motion-state', 'visible');
	await page.addStyleTag({ content: slowIndicatorMotion });

	const selectedTextColor = await previousTab.evaluate(
		(element) => window.getComputedStyle(element).color,
	);
	await nextTab.hover();
	const unselectedTextColor = await nextTab.evaluate(
		(element) => window.getComputedStyle(element).color,
	);
	await page.mouse.down();
	await expect(nextTab).toHaveAttribute('aria-selected', 'false');
	await expect
		.poll(() => getPseudoElementStyles(nextTab, '::before').then((styles) => styles.opacity))
		.toBe('1');
	await page.mouse.up();

	await expect(previousTab).toHaveAttribute('data-motion-state', 'exiting');
	await expect(previousTab).toHaveAttribute('data-motion-direction', 'right');
	await expect(nextTab).toHaveAttribute('data-motion-state', 'entering');
	await expect(nextTab).toHaveAttribute('data-motion-direction', 'right');
	const exitingIndicator = await getPseudoElementStyles(previousTab, '::after');
	const enteringIndicator = await getPseudoElementStyles(nextTab, '::after');
	const neutralUnderline = await getPseudoElementStyles(nextTab, '::before');

	expect(enteringIndicator.borderBlockEndStyle).toBe('solid');
	expect(enteringIndicator.borderBlockEndWidth).toBe('2px');
	expect(enteringIndicator.borderBlockEndColor).not.toBe(neutralUnderline.borderBlockEndColor);
	expect(enteringIndicator.zIndex).toBe('1');
	expect(neutralUnderline.zIndex).toBe('auto');
	expect(neutralUnderline.opacity).toBe('1');
	expect(enteringIndicator.animationDuration).toContain('5s');
	expect(enteringIndicator.animationName).toContain('SlideInRight8px');
	expect(enteringIndicator.animationName).toContain('FadeIn0to100');
	expect(enteringIndicator.opacity).not.toBe('1');
	expect(exitingIndicator.animationDuration).toContain('5s');
	expect(exitingIndicator.animationName).toContain('SlideOutRight8px');
	expect(exitingIndicator.animationName).toContain('FadeOut100to0');
	expect(exitingIndicator.opacity).not.toBe('0');
	await expect(nextTab).toHaveCSS('color', selectedTextColor);
	await expect(previousTab).toHaveCSS('color', unselectedTextColor);
	await expect(previousTab).toHaveAttribute('data-motion-state', 'exiting');
});

test('does not visually change an already-selected tab while it is pressed', async ({ page }) => {
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);

	const tab = page.getByTestId('tab-1');
	await expect(tab).toHaveAttribute('data-motion-state', 'visible');
	await tab.hover();
	await expect
		.poll(() => getPseudoElementStyles(tab, '::before').then((styles) => styles.opacity))
		.toBe('1');

	const selectedVisual = await tab.evaluate((element) => {
		const underlineStyles = window.getComputedStyle(element, '::before');
		const indicatorStyles = window.getComputedStyle(element, '::after');
		return {
			color: window.getComputedStyle(element).color,
			indicatorAnimationName: indicatorStyles.animationName,
			indicatorBorderBlockEndColor: indicatorStyles.borderBlockEndColor,
			indicatorOpacity: indicatorStyles.opacity,
			indicatorZIndex: indicatorStyles.zIndex,
			underlineOpacity: underlineStyles.opacity,
		};
	});

	await page.mouse.down();
	await expect(tab).toHaveAttribute('aria-selected', 'true');
	await expect
		.poll(() =>
			tab.evaluate((element) => {
				const underlineStyles = window.getComputedStyle(element, '::before');
				const indicatorStyles = window.getComputedStyle(element, '::after');
				return {
					color: window.getComputedStyle(element).color,
					indicatorAnimationName: indicatorStyles.animationName,
					indicatorBorderBlockEndColor: indicatorStyles.borderBlockEndColor,
					indicatorOpacity: indicatorStyles.opacity,
					indicatorZIndex: indicatorStyles.zIndex,
					underlineOpacity: underlineStyles.opacity,
				};
			}),
		)
		.toEqual(selectedVisual);
	await page.mouse.up();
});

test('settles selection immediately when reduced motion is preferred', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<typeof import('../../../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'tabs',
		'testing',
		{ featureFlag, 'react-18-mode': 'modern' },
	);

	const selectedTab = page.getByTestId('tab-3');
	await selectedTab.click();

	await expect(selectedTab).toHaveAttribute('role', 'tab');
	await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
	await expect(selectedTab).toHaveAttribute('data-motion-state', 'visible');
	await expect(selectedTab).toHaveAttribute('data-motion-direction', 'right');
	await expect(selectedTab).toHaveCSS('transition-property', 'none');
	const neutralUnderline = await getPseudoElementStyles(selectedTab, '::before');
	const selectedIndicator = await getPseudoElementStyles(selectedTab, '::after');
	expect(neutralUnderline.transitionProperty).toBe('none');
	expect(selectedIndicator.animationName).toBe('none');
	expect(selectedIndicator.borderBlockEndStyle).toBe('solid');
	expect(selectedIndicator.borderBlockEndWidth).toBe('2px');
	expect(selectedIndicator.opacity).toBe('1');
	expect(selectedIndicator.zIndex).toBe('1');
	await expect(page.locator('[data-motion-state]')).toHaveCount(1);

	await selectedTab.evaluate((element) => {
		element.setAttribute('dir', 'rtl');
		element.setAttribute('data-motion-state', 'entering');
		element.setAttribute('data-motion-direction', 'right');
	});
	await expect(selectedTab).toHaveAttribute('data-motion-state', 'entering');
	await expect(selectedTab).toHaveAttribute('data-motion-direction', 'right');
	expect((await getPseudoElementStyles(selectedTab, '::after')).animationName).toBe('none');
});

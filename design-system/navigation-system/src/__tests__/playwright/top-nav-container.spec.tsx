import { expect, type Locator, test } from '@af/integration-testing';

for (const newTheme of [false, true]) {
	test(`container presentation works before and after hydration (new theme: ${newTheme})`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
			'design-system',
			'navigation-system',
			'top-nav-container-ssr',
			{
				featureFlag: newTheme
					? ['platform-dst-chat-panel-layout', 'platform_dst_nav4_custom_theming_fhs_1'].join(',')
					: 'platform-dst-chat-panel-layout',
			},
		);
		const header = page.getByTestId('container-top-nav');
		const start = page.getByTestId('container-top-nav-start');
		const title = page.getByTestId('container-top-nav-title');
		const middle = page.getByTestId('container-search').locator('..');
		const settings = page.getByRole('button', { name: 'Settings' });
		// Search keeps one button mounted and switches its presentation spans at the breakpoint.
		const searchField = page.getByTestId('container-search').locator('button > span').first();
		const create = header.getByRole('button', { name: 'Create', exact: true });
		const rovo = header.getByRole('button', { name: 'Ask Rovo', exact: true });
		const resize = async (width: number) => {
			// Size the slot independently of Root's desktop main-area minimum.
			await header.evaluate((element, value) => {
				element.style.width = `${value}px`;
			}, width);
			await expect(header).toHaveWidth(width);
		};
		for (const width of [1200, 1024, 1023, 800, 768, 767, 480, 479, 320, 270, 1200]) {
			await resize(width);
			await expect(searchField).toHaveCSS('display', width < 480 ? 'none' : 'grid');
			await expect(middle).toHaveCSS('display', width < 768 ? 'flex' : 'grid');
			await expect(start).toHaveCSS('min-width', width < 1024 ? 'max-content' : '330px');
			await expect(title).toBeVisible({ visible: width >= 1024 });
			await expect(page.getByText('Confluence', { exact: true })).toBeVisible({
				visible: width >= 1024,
			});
			await expect(settings).toBeVisible({ visible: width >= 768 });
			const startBounds = (await start.boundingBox())!;
			const middleBounds = (await middle.boundingBox())!;
			expect(startBounds.x + startBounds.width).toBeLessThanOrEqual(middleBounds.x);
			await expect(page.getByRole('button', { name: 'Hydrate navigation' })).toBeEnabled();
			await expect(header.getByRole('button', { name: /sidebar/i })).toBeVisible();
			await expect(header.getByRole('button', { name: 'Switch apps' })).toBeVisible();
			await expect(header.getByRole('link', { name: 'Home' })).toBeVisible();
			await expect(
				header.getByRole('button', {
					name: 'Seiten, Bereiche und Personen durchsuchen',
					exact: true,
				}),
			).toBeVisible();
			await expect(create).toHaveCount(1);
			await expect(rovo).toHaveCount(1);
			await expect(create).toHaveWidth(32);
			await expect(rovo).toHaveWidth(32);
			// Include every visible control: scrollWidth alone misses overlapping grid children.
			await expect.poll(() => layoutProblems(header)).toEqual([]);
			expect(await header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
				true,
			);
		}
		// Exercise actual narrow viewports as well as a narrow container on desktop.
		// 320 CSS pixels represents a 1280px viewport at 400% browser zoom.
		for (const width of [320, 270]) {
			await page.setViewportSize({ width, height: 900 });
			await resize(width);
			await expect(middle).toHaveCSS('display', 'flex');
			await expect(title).toBeHidden();
			await expect.poll(() => layoutProblems(header)).toEqual([]);
			expect(await header.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
				true,
			);
		}
		await page.setViewportSize({ width: 1600, height: 900 });
		await resize(800);
		await page.addStyleTag({ content: 'html { font-size: 20px; }' });
		await expect(middle).toHaveCSS('display', 'flex');
		await expect(settings).toBeHidden();
		await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
		await page.getByRole('button', { name: 'Hydrate navigation' }).click();
		await page.getByRole('button', { name: 'Show more' }).click();
		await expect(settings).toBeVisible();
		await page.addStyleTag({ content: 'html { font-size: 16px; }' });
		await expect(middle).toHaveCSS('display', 'grid');
		await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
		await expect(settings).toBeVisible();
		// Recheck the spec’s supported widths after hydration, including the overflow trigger.
		// The full seven-control row has a 320px minimum; SSR is stress-tested at 270px above.
		for (const width of [767, 320]) {
			await resize(width);
			const overflow = header.getByRole('button', { name: 'Show more' });
			await expect(overflow).toHaveCount(1);
			await expect(create).toHaveWidth(32);
			await expect(rovo).toHaveWidth(32);
			await expect.poll(() => layoutProblems(header)).toEqual([]);
			await expect
				.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth))
				.toBe(true);
			const headerBounds = (await header.boundingBox())!;
			const triggerBounds = (await overflow.boundingBox())!;
			expect(triggerBounds.x + triggerBounds.width).toBeLessThanOrEqual(
				headerBounds.x + headerBounds.width,
			);
			await overflow.click();
			await expect(settings).toBeVisible();
			await overflow.click();
			await expect(settings).toBeHidden();
		}
		for (const width of [768, 1200]) {
			await resize(width);
			await expect(header.getByRole('button', { name: 'Show more' })).toHaveCount(0);
			await expect.poll(async () => (await create.boundingBox())!.width).toBeGreaterThan(32);
			await expect.poll(async () => (await rovo.boundingBox())!.width).toBeGreaterThan(32);
			await expect.poll(() => layoutProblems(header)).toEqual([]);
			await expect(settings).toBeVisible();
			await expect
				.poll(() => header.evaluate((element) => element.scrollWidth <= element.clientWidth))
				.toBe(true);
		}
	});
}

test('gate off retains viewport presentation when the host narrows', async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
		'design-system',
		'navigation-system',
		'top-nav-container-ssr',
	);
	await page.getByTestId('container-top-nav-host').evaluate((host) => {
		host.style.width = '600px';
	});
	await expect(page.getByTestId('container-top-nav-title')).toBeVisible();
	await expect(page.getByTestId('container-top-nav-start')).toHaveCSS('min-width', '330px');
	await expect(page.getByTestId('container-search').locator('..')).toHaveCSS('display', 'grid');
});

async function layoutProblems(header: Locator): Promise<string[]> {
	return header.evaluate((element) => {
		const bounds = element.getBoundingClientRect();
		const problems: string[] = [];
		if (element.scrollWidth > element.clientWidth + 1) {
			problems.push(`Navigation overflows: ${element.scrollWidth} > ${element.clientWidth}`);
		}
		const controls = Array.from(
			element.querySelectorAll<HTMLElement>('button, a, input, [role="button"]'),
		).filter((control) => {
			const rect = control.getBoundingClientRect();
			return rect.width > 1 && rect.height > 1 && getComputedStyle(control).visibility !== 'hidden';
		});
		const label = (control: HTMLElement) =>
			control.getAttribute('aria-label') || control.textContent || control.tagName;
		for (const [index, control] of controls.entries()) {
			const rect = control.getBoundingClientRect();
			if (
				rect.left < bounds.left - 1 ||
				rect.right > bounds.right + 1 ||
				rect.top < bounds.top - 1 ||
				rect.bottom > bounds.bottom + 1
			) {
				problems.push(`${label(control)} lies outside navigation`);
			}
			for (const other of controls.slice(index + 1)) {
				if (control.contains(other) || other.contains(control)) {
					continue;
				}
				const otherRect = other.getBoundingClientRect();
				if (
					Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left) > 1 &&
					Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top) > 1
				) {
					problems.push(`${bounds.width}px: ${label(control)} overlaps ${label(other)}`);
				}
			}
		}
		return problems;
	});
}

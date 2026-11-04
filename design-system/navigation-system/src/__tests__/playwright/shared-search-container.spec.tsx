import { expect, type Locator, type Page, test } from '@af/integration-testing';

const searchLabel = 'Seiten, Bereiche und Personen durchsuchen';

for (const newTheme of [false, true]) {
	test(`shared Search preserves its custom-theme icon and tooltip (new theme: ${newTheme})`, async ({
		page,
	}) => {
		const { header, search, resize } = await setupComponent(page, newTheme, true, true);
		await resize(320);
		const originalButton = (await search.elementHandle())!;
		await page.keyboard.press('Tab');
		await search.focus();
		await expect(page.getByRole('tooltip')).toHaveText(searchLabel);
		const icon = search.locator(':scope > span').last();
		await expect(icon).toHaveCSS(
			'color',
			await header.evaluate((element) => getComputedStyle(element).color),
		);
		await resize(480);
		await expect
			.poll(() => originalButton.evaluate((element) => element === document.activeElement))
			.toBe(true);
		await resize(320);
		await expect(search).toHaveWidth(32);
		await expect
			.poll(() => originalButton.evaluate((element) => element === document.activeElement))
			.toBe(true);
	});

	test(`shared Search keeps keyboard focus across its container breakpoint (new theme: ${newTheme})`, async ({
		page,
	}) => {
		const { header, field, search, resize } = await setupComponent(page, newTheme, true);
		await resize(480);
		await search.focus();
		const originalButton = (await search.elementHandle())!;
		await resize(479);
		await expect(field).toBeHidden();
		await expect(search).toBeFocused();
		await expect
			.poll(() => originalButton.evaluate((element) => element === document.activeElement))
			.toBe(true);
		await resize(480);
		await expect(field).toBeVisible();
		await expect(search).toBeFocused();
		await expect
			.poll(() => originalButton.evaluate((element) => element === document.activeElement))
			.toBe(true);
		await expect(header.locator('[data-testid="container-search"] button')).toHaveCount(1);

		// A keyboard activation must still reach Search after each presentation change.
		await header.evaluate((element) => {
			element.onclick = (event) => {
				if ((event.target as HTMLElement).closest('[data-testid="container-search"]')) {
					element.setAttribute('data-search-activated', 'true');
				}
			};
		});
		await page.keyboard.press('Enter');
		await expect(header).toHaveAttribute('data-search-activated', 'true');
		await header.evaluate((element) => element.removeAttribute('data-search-activated'));
		await resize(479);
		await expect(search).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(header).toHaveAttribute('data-search-activated', 'true');

		// Space activates Search in every browser, regardless of native :active styling.
		await header.evaluate((element) => element.removeAttribute('data-search-activated'));
		await page.keyboard.press('Space');
		await expect(header).toHaveAttribute('data-search-activated', 'true');
		await expect(search).toBeFocused();

		// Pointer activation must show pressed feedback in every browser.
		const compactPresentation = search.locator(':scope > span').last();
		await search.hover();
		const hoveredBackground = await compactPresentation.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		);
		await page.mouse.down();
		await expect
			.poll(() =>
				compactPresentation.evaluate((element) => getComputedStyle(element).backgroundColor),
			)
			.not.toBe(hoveredBackground);
		await page.mouse.up();

		// Do not reclaim focus after the user tabs out of Search.
		await page.keyboard.press('Tab');
		const nextControl = (await page.locator(':focus').elementHandle())!;
		await expect(search).not.toBeFocused();
		await expect
			.poll(() => nextControl.evaluate((element) => element === document.activeElement))
			.toBe(true);
		await resize(480);
		await expect
			.poll(() => nextControl.evaluate((element) => element === document.activeElement))
			.toBe(true);
		await resize(479);
		await expect
			.poll(() => nextControl.evaluate((element) => element === document.activeElement))
			.toBe(true);

		// Explicit blur must not leave a pending restoration for a later resize.
		await search.focus();
		await search.evaluate((element) => element.blur());
		await resize(480);
		await expect(field).toBeVisible();
		await expect(search).not.toBeFocused();
	});

	test(`compact Search shows keyboard pressed feedback (new theme: ${newTheme})`, async ({
		page,
		browserName,
	}) => {
		// Firefox does not apply :active to native buttons while Space is held.
		test.skip(browserName === 'firefox', 'Firefox does not show native keyboard :active styling');
		const { search, resize } = await setupComponent(page, newTheme, true);
		await resize(479);
		await search.focus();
		await page.mouse.move(0, 0);
		const compactPresentation = search.locator(':scope > span').last();
		const background = await compactPresentation.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		);
		await page.keyboard.down('Space');
		await expect
			.poll(() =>
				compactPresentation.evaluate((element) => getComputedStyle(element).backgroundColor),
			)
			.not.toBe(background);
		await page.keyboard.up('Space');
	});

	for (const hydrated of [false, true]) {
		test(`shared Search follows container width (new theme: ${newTheme}, hydrated: ${hydrated})`, async ({
			page,
		}) => {
			const { header, field, search, resize } = await setupComponent(page, newTheme, hydrated);
			for (const width of [320, 479, 320]) {
				await resize(width);
				await expect(field).toHaveCSS('display', 'none');
				await expect(search).toHaveCount(1);
				await expect(search).toHaveWidth(32);
				await expect.poll(() => layoutProblems(header)).toEqual([]);
				await search.focus();
				await expect(search).toBeFocused();
			}
			for (const width of [480, 767, 1200]) {
				await resize(width);
				await expect(field).toHaveCSS('display', 'grid');
				await expect(search).toHaveCount(1);
				await expect(search).toBeVisible();
				// Keep translated text within its own grid track, clear of both icons.
				const label = field.locator(':scope > span').nth(1);
				await expect(label).toHaveCSS('overflow', 'hidden');
				await expect(label).toHaveCSS('text-overflow', 'ellipsis');
				const labelBounds = (await label.boundingBox())!;
				const iconBounds = (await field.locator('span').first().boundingBox())!;
				expect(labelBounds.x).toBeGreaterThanOrEqual(iconBounds.x + iconBounds.width);
				await expect.poll(() => layoutProblems(header)).toEqual([]);
			}
			// Return to the compact presentation without changing the viewport.
			await resize(320);
			await expect(search).toHaveWidth(32);
			await expect.poll(() => layoutProblems(header)).toEqual([]);
		});
	}
}

test('shared Search retains viewport presentation with the layout gate off', async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
		'design-system',
		'navigation-system',
		'top-nav-container-ssr',
	);
	await page.getByTestId('container-top-nav').evaluate((element) => {
		element.style.width = '320px';
	});
	const field = page.getByTestId('container-search').locator('button').first();
	await expect(field).toHaveCSS('display', 'grid');
	await page.setViewportSize({ width: 320, height: 900 });
	await expect(field).toHaveCSS('display', 'none');
	await expect(page.getByRole('button', { name: searchLabel, exact: true })).toHaveWidth(32);
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

async function setupComponent(
	page: Page,
	newTheme: boolean,
	hydrated: boolean,
	customTheme = false,
) {
	await page.setViewportSize({ width: 1600, height: 900 });
	await page.visitExample<typeof import('../../../examples/top-nav-container-ssr')>(
		'design-system',
		'navigation-system',
		'top-nav-container-ssr',
		{
			featureFlag: newTheme
				? 'platform-dst-chat-panel-layout,platform_dst_nav4_custom_theming_fhs_1'
				: 'platform-dst-chat-panel-layout',
		},
	);
	if (customTheme) {
		await page.getByRole('button', { name: 'Use custom theme' }).click();
	}
	const header = page.getByTestId('container-top-nav');
	const resize = async (width: number) => {
		await header.evaluate((element, width) => {
			element.style.width = `${width}px`;
		}, width);
		await expect(header).toHaveWidth(width);
	};
	await resize(320);
	if (hydrated) {
		await page.getByRole('button', { name: 'Hydrate navigation' }).click();
		await expect(header.getByRole('button', { name: 'Show more' })).toBeVisible();
	}
	return {
		header,
		field: page.getByTestId('container-search').locator('button > span').first(),
		search: header.getByRole('button', { name: searchLabel, exact: true }),
		resize,
	};
}

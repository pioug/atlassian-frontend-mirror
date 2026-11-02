import { expect, test } from '@af/integration-testing';

const experimentOverride = JSON.stringify({
	platform_editor_embed_open_in_new_tab: { isEnabled: true },
});

const frameHref = 'embed-frame-navigation-target';

test.describe('Expanded embed frame navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/embed-frame-navigation.tsx')>(
			'linking-platform',
			'smart-card',
			'embed-frame-navigation',
			{ platformExperimentOverrides: experimentOverride },
		);
		await expect(page.getByTestId('embed-frame')).toBeVisible();
	});

	test('the title link receives hit tests from all four outer padding edges', async ({ page }) => {
		const frame = page.getByTestId('embed-frame');
		await expect(page.getByRole('link', { name: 'Project overview' })).toHaveCSS(
			'cursor',
			'pointer',
		);
		const points = await frame.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return [
				{ x: rect.left + rect.width / 2, y: rect.top + 4 },
				{ x: rect.right - 4, y: rect.top + rect.height / 2 },
				{ x: rect.left + rect.width / 2, y: rect.bottom - 4 },
				{ x: rect.left + 4, y: rect.top + rect.height / 2 },
			];
		});

		for (const point of points) {
			const targetHref = await page.evaluate(({ x, y }) => {
				const target = document.elementFromPoint(x, y);
				return target instanceof Element ? target.closest('a')?.getAttribute('href') : null;
			}, point);

			expect(targetHref).toContain(frameHref);
		}
	});

	test('right-clicks on all four outer padding edges target the title link without cancelling contextmenu', async ({
		page,
	}) => {
		const frame = page.getByTestId('embed-frame');
		const points = await frame.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return [
				{ x: rect.left + rect.width / 2, y: rect.top + 4 },
				{ x: rect.right - 4, y: rect.top + rect.height / 2 },
				{ x: rect.left + rect.width / 2, y: rect.bottom - 4 },
				{ x: rect.left + 4, y: rect.top + rect.height / 2 },
			];
		});

		for (const point of points) {
			const contextMenuEvent = page.evaluate(
				() =>
					new Promise<{ defaultPrevented: boolean; targetHref: string | null }>((resolve) => {
						document.addEventListener(
							'contextmenu',
							(event) => {
								const target = event.target;
								resolve({
									targetHref:
										target instanceof Element
											? (target.closest('a')?.getAttribute('href') ?? null)
											: null,
									defaultPrevented: event.defaultPrevented,
								});
							},
							{ once: true },
						);
					}),
			);

			await page.mouse.click(point.x, point.y, { button: 'right' });
			const result = await contextMenuEvent;
			expect(result.targetHref).toContain(frameHref);
			expect(result.defaultPrevented).toBe(false);
		}
	});

	test('modified clicks stay with header controls and embedded content', async ({ page }) => {
		const headerControl = page.getByTestId('embed-frame-header-control');
		await headerControl.click({ modifiers: ['ControlOrMeta'] });
		await expect(headerControl).toHaveAttribute('aria-pressed', 'true');

		const contentButton = page.getByTestId('embed-frame-content-button');
		await contentButton.click({ modifiers: ['ControlOrMeta'] });
		await expect(contentButton).toHaveAttribute('aria-pressed', 'true');

		const embeddedButton = page
			.frameLocator('[data-testid="embed-frame-iframe"]')
			.getByRole('button');
		await embeddedButton.click({ modifiers: ['ControlOrMeta'] });
		await expect(embeddedButton).toHaveText('Clicked');

		expect(page.context().pages()).toHaveLength(1);
	});
});

test('the title does not stretch over the frame padding when the experiment is disabled', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/embed-frame-navigation.tsx')>(
		'linking-platform',
		'smart-card',
		'embed-frame-navigation',
		{
			platformExperimentOverrides: JSON.stringify({
				platform_editor_embed_open_in_new_tab: { isEnabled: false },
			}),
		},
	);

	const title = page.getByRole('link', { name: 'Project overview' });
	await expect(title).toBeVisible();
	const overlayPosition = await title.evaluate(
		(element) => getComputedStyle(element, '::after').position,
	);
	expect(overlayPosition).toBe('static');
});

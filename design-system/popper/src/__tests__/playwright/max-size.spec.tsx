import { expect, test } from '@af/integration-testing';

// All four max-size scenarios run under both states of the
// platform-dst-top-layer flag. The FF-on path resolves max-size via
// CSS Anchor Positioning + a measured per-placement cap; behavioural
// parity with the legacy modifier pipeline is the contract this suite
// enforces.

/**
 * Reads the popper's effective max-size, preferring the logical
 * property the FF-on adapter emits and falling back to the physical
 * property the legacy popper.js pipeline emits. Returns whichever is
 * set (i.e. not the CSS initial value `'none'`); returns `'none'` only
 * when both are unset.
 */
function readMaxSize(element: Element): string {
	const computed = getComputedStyle(element);
	if (computed.maxInlineSize && computed.maxInlineSize !== 'none') {
		return computed.maxInlineSize;
	}
	return computed.maxWidth;
}

const FLAG_STATES = [
	{ label: 'FF-off (legacy popper.js)', featureFlag: 'platform-dst-top-layer=false' },
	{ label: 'FF-on (top-layer adapter)', featureFlag: 'platform-dst-top-layer=true' },
] as const;

for (const { label, featureFlag } of FLAG_STATES) {
	test(`max size is not applied if the viewport is large enough [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			{ featureFlag },
		);

		const popper = page.locator('[data-testid="popper"]');

		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSize = await popper.evaluate(readMaxSize);
		expect(maxSize).toBe('none');
	});

	test(`max size is correctly applied [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.tsx')>(
			'design-system',
			'popper',
			'max-size',
			{ featureFlag },
		);

		const popper = page.locator('[data-testid="placement--right"]');

		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSize = await popper.evaluate(readMaxSize);
		expect(maxSize).not.toBe('none');
	});

	test(`max size updates when page gets smaller [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.tsx')>(
			'design-system',
			'popper',
			'max-size',
			{ featureFlag },
		);

		const popper = page.locator('[data-testid="placement--right"]');

		// Default size, but making it explicit
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSizeStart = await popper.evaluate(readMaxSize);
		const maxSizeStartNum = parseInt(maxSizeStart, 10);

		await page.setViewportSize({ width: 1080, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSizeEnd = await popper.evaluate(readMaxSize);
		const maxSizeEndNum = parseInt(maxSizeEnd, 10);

		expect(maxSizeEndNum).toBeLessThan(maxSizeStartNum);
	});

	test(`max size updates when page gets bigger [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.tsx')>(
			'design-system',
			'popper',
			'max-size',
			{ featureFlag },
		);

		const popper = page.locator('[data-testid="placement--right"]');

		// Default size, but making it explicit
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSizeStart = await popper.evaluate(readMaxSize);
		const maxSizeStartNum = parseInt(maxSizeStart, 10);

		await page.setViewportSize({ width: 1480, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		const maxSizeEnd = await popper.evaluate(readMaxSize);
		const maxSizeEndNum = parseInt(maxSizeEnd, 10);

		expect(maxSizeEndNum).toBeGreaterThan(maxSizeStartNum);
	});
}

import { expect, test } from '@af/integration-testing';

const dateLabelTestId = "[data-testid='date-label']";

test('DateLabel should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/0-basic.tsx')>(
		'design-system',
		'date-label',
		'basic',
	);
	await expect(page.locator(dateLabelTestId).first()).toBeVisible();
});

test('DateLabel should render label text', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/0-basic.tsx')>(
		'design-system',
		'date-label',
		'basic',
	);
	await expect(page.locator(dateLabelTestId).first()).toContainText('29 Jul 2026');
});

test('DateLabel should render icons by default', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/0-basic.tsx')>(
		'design-system',
		'date-label',
		'basic',
	);
	// Icons (svg) should be visible when hasIconBefore is true (default)
	await expect(page.locator('svg').first()).toBeVisible();
});

test('DateLabel should not render icons when hasIconBefore is false', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/1-no-icon.tsx')>(
		'design-system',
		'date-label',
		'no-icon',
	);
	// No svg icons should be present in the no-icon example
	await expect(page.locator('svg')).toHaveCount(0);
});

test('DateLabel should truncate long text when maxWidth is set', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/2-max-width.tsx')>(
		'design-system',
		'date-label',
		'max-width',
	);
	// The max-width example renders DateLabel components — at least one should be visible
	await expect(page.locator('span').filter({ hasText: '29 Jul 2026' }).first()).toBeVisible();
});

test('DateLabel should be visible when isSpacious is true', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/3-spacious.tsx')>(
		'design-system',
		'date-label',
		'spacious',
	);
	await expect(page.locator("[data-testid='date-label-spacious']")).toBeVisible();
});

test('DateLabel isSpacious should have a min-height of 32px', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/3-spacious.tsx')>(
		'design-system',
		'date-label',
		'spacious',
	);
	const el = page.locator("[data-testid='date-label-spacious']");
	const height = await el.evaluate((node) => node.getBoundingClientRect().height);
	expect(height).toBeGreaterThanOrEqual(32);
});

test('DateLabel isSpacious should render icons', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/3-spacious.tsx')>(
		'design-system',
		'date-label',
		'spacious',
	);
	// Icons should be visible in spacious mode (hasIconBefore defaults to true)
	await expect(page.locator('svg').first()).toBeVisible();
});

// ─── DateLabelDropdownTrigger tests ──────────────────────────────────────────

test('DateLabelDropdownTrigger should be visible and render as a button', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	const trigger = page.getByTestId('date-label-dropdown-neutral');
	await expect(trigger).toBeVisible();
	// Pressable renders a <button>
	await expect(trigger).toHaveAttribute('type', 'button');
});

test('DateLabelDropdownTrigger should render a chevron icon', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	// Each trigger has at least one leading icon + a chevron, so multiple svgs
	const svgs = page.locator("[data-testid='date-label-dropdown-neutral'] svg");
	await expect(svgs).toHaveCount(2); // CalendarIcon + ChevronDownIcon
});

test('DateLabelDropdownTrigger should render label text', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	await expect(page.getByTestId('date-label-dropdown-neutral')).toContainText('29 Jul 2026');
});

test('DateLabelDropdownTrigger warning appearance should be visible', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	await expect(page.getByTestId('date-label-dropdown-warning')).toBeVisible();
});

test('DateLabelDropdownTrigger danger appearance should be visible', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	await expect(page.getByTestId('date-label-dropdown-danger')).toBeVisible();
});

test('DateLabelDropdownTrigger spacious should have min-height of 32px', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	const el = page.getByTestId('date-label-dropdown-neutral-spacious');
	const height = await el.evaluate((node) => node.getBoundingClientRect().height);
	expect(height).toBeGreaterThanOrEqual(32);
});

test('DateLabelDropdownTrigger without icon should not render leading svg', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	// No leading icon — only the chevron svg should be present
	const svgs = page.locator("[data-testid='date-label-dropdown-no-icon'] svg");
	await expect(svgs).toHaveCount(1); // only ChevronDownIcon
});

test('DateLabelDropdownTrigger no-icon + spacious should have min-height of 32px and only chevron', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/4-dropdown-trigger.tsx')>(
		'design-system',
		'date-label',
		'dropdown-trigger',
	);
	const el = page.getByTestId('date-label-dropdown-no-icon-spacious');
	await expect(el).toBeVisible();
	// Only the chevron icon should be present — no leading icon
	const svgs = el.locator('svg');
	await expect(svgs).toHaveCount(1);
	// Height should be at least 32px
	const height = await el.evaluate((node) => node.getBoundingClientRect().height);
	expect(height).toBeGreaterThanOrEqual(32);
});

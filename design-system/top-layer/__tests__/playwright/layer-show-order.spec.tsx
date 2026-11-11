import { expect, type Page, test } from '@af/integration-testing';

/**
 * The top layer is ordered by show order: the layer that shows last is on top. React runs child
 * layout effects before parent ones, so a layer that opens in the same commit as its parent used to
 * show first and sit below it. Each layer here is smaller than its parent and centered on it, so a
 * covered layer is easy to detect: the innermost layer must receive the pointer and the focus.
 *
 * The show order is a defensive fix for React's effect order, not support for the pattern. Do not
 * design nested layers to open in the same commit (see
 * `notes/decisions/nested-layers-open-together-a11y.md`).
 */

const scenarios = {
	'dialog-dialog': 2,
	'dialog-popover': 2,
	'popover-popover': 2,
	'popover-dialog': 2,
	'dialog-popover-dialog': 3,
	'popover-dialog-popover': 3,
	'dialog-auto-popover': 2,
	'auto-popover-auto-popover': 2,
} as const;

type TScenario = keyof typeof scenarios;

async function visit({ page }: { page: Page }) {
	await page.visitExample<typeof import('../../examples/170-testing-layer-show-order.tsx')>(
		'design-system',
		'top-layer',
		'testing-layer-show-order',
	);
}

// Whether the topmost element at the center of `from` is inside `inside`.
async function isHitInside({
	page,
	from,
	inside,
}: {
	page: Page;
	from: string;
	inside: string;
}): Promise<boolean> {
	const container = await page.getByTestId(inside).elementHandle();
	return page.getByTestId(from).evaluate((element, containerElement) => {
		const box = element.getBoundingClientRect();
		const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
		return hit !== null && containerElement !== null && containerElement.contains(hit);
	}, container);
}

async function expectInnermostOnTop({ page, count }: { page: Page; count: number }) {
	const innermost = count - 1;

	const levels = Array.from({ length: count }, (_, level) => level);

	await Promise.all(
		levels.map((level) => expect(page.getByTestId(`button-${level}`)).toBeVisible()),
	);

	// All layers are centered on each other. If a layer covered the innermost one, the pointer at
	// the shared center would hit that layer instead.
	const hits = await Promise.all(
		levels.map((level) =>
			isHitInside({ page, from: `layer-${level}`, inside: `layer-${innermost}` }),
		),
	);
	expect(hits).toEqual(levels.map(() => true));
	await page.getByTestId(`button-${innermost}`).click({ trial: true });

	// Initial focus lands in the innermost layer, which is the last to show.
	await expect(page.getByTestId(`layer-${innermost}`).locator(':focus')).toHaveCount(1);
}

test.describe('Layer show order', () => {
	(Object.entries(scenarios) as [TScenario, number][]).forEach(([scenario, count]) => {
		test(`${scenario}: layers that mount open together show in order`, async ({ page }) => {
			await visit({ page });

			await page.getByTestId(`mount-${scenario}`).click();

			await expect(page.getByTestId('layer-0')).toBeVisible();
			await expectInnermostOnTop({ page, count });
		});

		test(`${scenario}: layers that open in one update show in order`, async ({ page }) => {
			await visit({ page });
			await page.getByTestId(`prepare-${scenario}`).click();
			await expect(page.getByTestId('layer-0')).toBeHidden();

			await page.getByTestId('open-all').click();

			await expect(page.getByTestId('layer-0')).toBeVisible();
			await expectInnermostOnTop({ page, count });
		});
	});
});

import { expect, type Locator, test } from '@af/integration-testing';

/**
 * Popper: FF-on anchor toggle.
 *
 * The flag-on adapter derives `isOpen = effectiveReference != null` and calls
 * `useAnchoredPopover` and `useAnchoredPopoverAtPoint` with complementary
 * `isEnabled` flags. Going through `null` toggles both, so `referenceElement`
 * from anchor-A → null → anchor-B must reposition over anchor-B rather than
 * staying pinned to anchor-A. A switch from anchor-A to anchor-B while open
 * (no `null` between) must reposition too.
 */
const featureFlag = 'platform-dst-top-layer';

type TRect = { x: number; y: number; width: number; height: number };

async function readRect(locator: Locator): Promise<TRect> {
	return locator.evaluate((node) => {
		const rect = node.getBoundingClientRect();
		return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
	});
}

function isAttachedBelow({ popper, anchor }: { popper: TRect; anchor: TRect }): boolean {
	const horizontallyAligned = Math.abs(popper.x - anchor.x) < 24;
	const verticallyBelow = popper.y >= anchor.y + anchor.height - 4;
	return horizontallyAligned && verticallyBelow;
}

test('referenceElement toggle A → null → B repositions the popover', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/10-flag-anchor-toggle.tsx')>(
		'design-system',
		'popper',
		'flag-anchor-toggle',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	const anchorA = page.getByTestId('anchor-a');
	const anchorB = page.getByTestId('anchor-b');

	await expect(popper).toBeVisible();

	// Stage 1: attached to A. The popper's top edge should sit at or
	// just below A's bottom edge (bottom-start placement).
	const aRect = await readRect(anchorA);
	const popperRectA = await readRect(popper);
	expect(isAttachedBelow({ popper: popperRectA, anchor: aRect })).toBe(true);

	// Stage 2: close. The surface should be removed from the document.
	await page.getByTestId('close').click();
	await expect(popper).toBeHidden();

	// Stage 3: reopen on B. The surface should reposition under B,
	// not retain A's coordinates.
	await page.getByTestId('show-b').click();
	await expect(popper).toBeVisible();

	const bRect = await readRect(anchorB);

	await expect
		.poll(async () => {
			const next = await readRect(popper);
			return isAttachedBelow({ popper: next, anchor: bRect });
		})
		.toBe(true);
});

test('referenceElement switch A → B while open repositions the popover', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/10-flag-anchor-toggle.tsx')>(
		'design-system',
		'popper',
		'flag-anchor-toggle',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	const anchorA = page.getByTestId('anchor-a');
	const anchorB = page.getByTestId('anchor-b');

	await expect(popper).toBeVisible();
	expect(isAttachedBelow({ popper: await readRect(popper), anchor: await readRect(anchorA) })).toBe(
		true,
	);

	// Switch straight to B: the popover stays open the whole time.
	await page.getByTestId('show-b').click();
	await expect(popper).toBeVisible();

	const bRect = await readRect(anchorB);

	await expect
		.poll(async () => {
			const next = await readRect(popper);
			return isAttachedBelow({ popper: next, anchor: bRect });
		})
		.toBe(true);
});

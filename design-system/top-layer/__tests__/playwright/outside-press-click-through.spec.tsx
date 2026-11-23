import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

/**
 * A press outside a `manual` popover with `useManualLightDismiss` asks its owner after the press's
 * own `click`, as native light dismiss tells the owner of an `auto` popover after the `click`, and as
 * the legacy layers closed from `click`. So an owner that removes elements as the popover closes (a
 * blanket) cannot make the `click` land on the element under them, and the `click` handlers around
 * the press see the popover open.
 *
 * See notes/decisions/wrappers-ask-first-close.md.
 */

test.beforeEach(async ({ page }) => {
	await page.visitExample<
		typeof import('../../examples/174-testing-outside-press-click-through.tsx')
	>('design-system', 'top-layer', 'testing-outside-press-click-through');
});

test('a press on a blanket that the owner removes on close does not click the element under it', async ({
	page,
}) => {
	const under = page.getByTestId('under');
	await page.getByTestId('blanket-trigger').click();
	await expect(page.getByTestId('blanket-layer')).toBeVisible();
	await expect(page.getByTestId('blanket')).toBeVisible();

	// Press on the blanket, over the button under it.
	const box = await under.boundingBox();
	invariant(box, 'The button under the blanket has a box');
	await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

	await expect(page.getByTestId('blanket-layer')).toBeHidden();
	await expect(page.getByTestId('blanket')).toBeHidden();
	// The opening press logs `capture:closed around:click`. On the blanket press, the `click` went to
	// the page around the blanket (native listeners first) and to the blanket (React), while the
	// popover was open. Then the owner was asked. Nothing clicked the button under the blanket.
	await expect(page.getByTestId('log')).toHaveText(
		'capture:closed around:click capture:open around:click blanket:click close:light-dismiss',
	);
});

test('a press on the trigger of another popover that shares one open state opens it', async ({
	page,
}) => {
	await page.getByTestId('first-trigger').click();
	await expect(page.getByTestId('first-layer')).toBeVisible();

	await page.getByTestId('second-trigger').click();

	// The click opened the second popover and closed the first one, so the first one was not asked.
	await expect(page.getByTestId('second-layer')).toBeVisible();
	await expect(page.getByTestId('first-layer')).toBeHidden();
	await expect(page.getByTestId('log')).toHaveText('');
});

/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

test.describe('Positioning', () => {
	test('popover appears below trigger (block-end default)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/112-testing-popover-positioning.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-positioning',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const popover = page.getByTestId('popover-content');
		await expect(popover).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const popoverBox = await popover.boundingBox();
		invariant(triggerBox, 'trigger bounding box should exist');
		invariant(popoverBox, 'popover bounding box should exist');

		expect(popoverBox.y).toBeGreaterThan(triggerBox.y);
	});

	test('popover appears above trigger (block-start)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/112-testing-popover-positioning.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-positioning',
			{
				axis: 'block',
				edge: 'start',
			},
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const popover = page.getByTestId('popover-content');
		await expect(popover).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const popoverBox = await popover.boundingBox();
		invariant(triggerBox, 'trigger bounding box should exist');
		invariant(popoverBox, 'popover bounding box should exist');

		expect(popoverBox.y + popoverBox.height).toBeLessThanOrEqual(triggerBox.y + 2);
	});

	test('popover appears to the right of trigger (inline-end)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/112-testing-popover-positioning.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-positioning',
			{
				axis: 'inline',
				edge: 'end',
			},
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const popover = page.getByTestId('popover-content');
		await expect(popover).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const popoverBox = await popover.boundingBox();
		invariant(triggerBox, 'trigger bounding box should exist');
		invariant(popoverBox, 'popover bounding box should exist');

		expect(popoverBox.x).toBeGreaterThan(triggerBox.x);
	});

	test('popover flips when insufficient space below', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/113-testing-popover-flip.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-flip',
		);

		// Wait for the tall container to be rendered before scrolling
		await page.getByTestId('trigger-wrapper').waitFor({ state: 'visible' });
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 });

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const popover = page.getByTestId('popover-content');
		await expect(popover).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		const popoverBox = await popover.boundingBox();
		invariant(triggerBox, 'trigger bounding box should exist');
		invariant(popoverBox, 'popover bounding box should exist');

		expect(popoverBox.y + popoverBox.height).toBeLessThanOrEqual(triggerBox.y + 2);
	});

	test('width="trigger" makes popover match trigger width', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/114-testing-popover-width-trigger.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-width-trigger',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		const popover = page.getByTestId('popover-content');
		await expect(popover).toBeVisible();

		const triggerBox = await trigger.boundingBox();
		invariant(triggerBox, 'trigger bounding box should exist');

		const popoverElementWidth = await page.evaluate(() => {
			const content = document.querySelector('[data-testid="popover-content"]');
			const popoverEl = content?.closest('[popover]');
			return popoverEl?.getBoundingClientRect().width ?? 0;
		});

		expect(Math.abs(popoverElementWidth - triggerBox.width)).toBeLessThan(2);
	});
});

import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const tooltipOffset = 8;

/**
 * Mouse positioning relies on a virtual element that is used to position the tooltip.
 * This virtual element is the 1px square where the mouse is positioned.
 *
 * This must be accounted for when calculating the expected tooltip position.
 */
const virtualElementSize = 1;

test.describe('Tooltip mouse positioning', () => {
	test('should position tooltip at mouse coordinates with position="mouse" (old)', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'tooltip', 'position-mouse');

		const trigger = page.getByTestId('trigger-mouse');
		const triggerBox = await trigger.boundingBox();
		invariant(triggerBox !== null);

		/**
		 * Mouse position relative to the trigger
		 */
		const mouseOffset = {
			x: 20,
			y: 30,
		};

		// Hover over the trigger to show tooltip
		await trigger.hover({
			position: mouseOffset,
		});

		// Wait for tooltip to appear
		const tooltip = page.getByTestId('tooltip-mouse');
		await expect(tooltip).toBeVisible();

		// Get tooltip position
		const tooltipBox = await tooltip.boundingBox();
		invariant(tooltipBox !== null);

		// Using right-start position
		const expectedTooltipPosition = {
			// expected X position is the mouse X plus the tooltip offset
			x: triggerBox.x + mouseOffset.x + virtualElementSize + tooltipOffset,
			// expected Y position is the mouse Y
			y: triggerBox.y + mouseOffset.y + virtualElementSize,
		};

		expect(tooltipBox.x).toBe(expectedTooltipPosition.x);
		expect(tooltipBox.y).toBe(expectedTooltipPosition.y);
	});

	test('should position tooltip at mouse coordinates with position="mouse" (platform_dst_nav4_side_nav_resize_tooltip_feedback)', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'tooltip', 'position-mouse', {
			featureFlag: 'platform_dst_nav4_side_nav_resize_tooltip_feedback',
		});

		const trigger = page.getByTestId('trigger-mouse');
		const triggerBox = await trigger.boundingBox();
		invariant(triggerBox !== null);

		/**
		 * Mouse position relative to the trigger
		 */
		const mouseOffset = {
			x: 20,
			y: 30,
		};

		// Hover over the trigger to show tooltip
		await trigger.hover({
			position: mouseOffset,
		});

		// Wait for tooltip to appear
		const tooltip = page.getByTestId('tooltip-mouse');
		await expect(tooltip).toBeVisible();

		// Get tooltip position
		const tooltipBox = await tooltip.boundingBox();
		invariant(tooltipBox !== null);

		// Using right-start position
		const expectedTooltipPosition = {
			// expected X position is the mouse X plus the tooltip offset
			x: triggerBox.x + mouseOffset.x + virtualElementSize + tooltipOffset,
			// expected Y position is the mouse Y
			y: triggerBox.y + mouseOffset.y + virtualElementSize,
		};

		expect(tooltipBox.x).toBe(expectedTooltipPosition.x);
		expect(tooltipBox.y).toBe(expectedTooltipPosition.y);
	});

	test('should position tooltip using mouse Y and target X with position="mouse-y"', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'tooltip', 'position-mouse', {
			featureFlag: 'platform_dst_nav4_side_nav_resize_tooltip_feedback',
		});

		const trigger = page.getByTestId('trigger-mouse-y');
		const triggerBox = await trigger.boundingBox();
		invariant(triggerBox !== null);

		/**
		 * Mouse position relative to the trigger
		 */
		const mouseOffset = {
			x: 20,
			y: 30,
		};

		// Move mouse to a specific position (different from target center) and hover
		// First hover over the trigger to show tooltip
		await trigger.hover({
			position: mouseOffset,
		});

		// Wait for tooltip to appear
		const tooltip = page.getByTestId('tooltip-mouse-y');
		await expect(tooltip).toBeVisible();

		// Get tooltip position
		const tooltipBox = await tooltip.boundingBox();
		invariant(tooltipBox !== null);

		const expectedTooltipPosition = {
			// expected X position is the trigger's right edge plus the tooltip offset
			x: triggerBox.x + triggerBox.width + tooltipOffset,
			// expected Y position is so the tooltip is centered vertically with the mouse position
			y: triggerBox.y + mouseOffset.y + virtualElementSize - tooltipBox.height / 2,
		};

		expect(tooltipBox.x).toBe(expectedTooltipPosition.x);
		// Tooltip can be an even height, so cannot be exactly centered around a 1px position
		// So allowing for a small tolerance
		expect(Math.abs(tooltipBox.y - expectedTooltipPosition.y)).toBeLessThan(1);
	});

	test('should position tooltip using mouse X and target Y with position="mouse-x"', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'tooltip', 'position-mouse', {
			featureFlag: 'platform_dst_nav4_side_nav_resize_tooltip_feedback',
		});

		const trigger = page.getByTestId('trigger-mouse-x');
		const triggerBox = await trigger.boundingBox();
		invariant(triggerBox !== null);

		/**
		 * Mouse position relative to the trigger
		 */
		const mouseOffset = {
			x: 120,
			y: 30,
		};

		// Move mouse to a specific position (different from target center) and hover
		// First hover over the trigger to show tooltip
		await trigger.hover({
			position: mouseOffset,
		});

		// Wait for tooltip to appear
		const tooltip = page.getByTestId('tooltip-mouse-x');
		await expect(tooltip).toBeVisible();

		// Get tooltip position
		const tooltipBox = await tooltip.boundingBox();
		invariant(tooltipBox !== null);

		const expectedTooltipPosition = {
			// expected X position is so the tooltip is centered horizontally with the mouse position
			x: triggerBox.x + mouseOffset.x + virtualElementSize - tooltipBox.width / 2,
			// expected Y position is the trigger's bottom edge plus the tooltip offset
			y: triggerBox.y + triggerBox.height + tooltipOffset,
		};

		// Tooltip can be an even width, so cannot be exactly centered around a 1px position
		// So allowing for a small tolerance
		expect(Math.abs(tooltipBox.x - expectedTooltipPosition.x)).toBeLessThan(1);
		expect(tooltipBox.y).toBe(expectedTooltipPosition.y);
	});
});

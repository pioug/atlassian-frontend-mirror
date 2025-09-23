/* eslint-disable testing-library/prefer-screen-queries */
import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor Metrics - Latency: mouse events', () => {
	test.use({
		examplePage: 'latency-mouse-events',
	});

	test.describe('when doing a single click', () => {
		test('it should match the duration', async ({ page, getTimeline, waitForTicks }) => {
			const clickMeButton = page.getByTestId('click-me-button');

			await expect(clickMeButton).toBeVisible();

			await clickMeButton.click({
				// We are trying to simulate a real user click
				// eslint-disable-next-line playwright/no-force-option
				force: true,
			});

			// Before slow operation inside onClick callback
			const firstTickAt = await waitForTicks(1);

			// After slow operation inside onClick callback
			const secondTickAt = await waitForTicks(2);

			// After hardcoded slow async operation
			await waitForTicks(3);

			const timeline = await getTimeline();
			const mouseEvents = await (timeline?.getEventsPerType('user-event:mouse-action') || [])
				// Sometimes, when there is a delay between the mousedown and mouseup
				// the browser may record this a "mousedown" event as well
				// there is no good way to tell playwright to avoid this delay
				// @ts-expect-error
				.filter(({ data }) => data?.eventName === 'click');

			const internalOnClickDuration = secondTickAt - firstTickAt;

			expect(mouseEvents).toHaveLength(1);
			// @ts-expect-error
			expect(mouseEvents[0].startTime).toBeLessThanOrEqual(firstTickAt);
			// @ts-expect-error
			expect(mouseEvents[0].data?.duration).toBeGreaterThanOrEqual(internalOnClickDuration);
			// @ts-expect-error
			expect(mouseEvents[0].data?.elementName).toEqual('button[data-testid="click-me-button"]');
			// @ts-expect-error
			expect(mouseEvents[0].data?.eventName).toEqual('click');
		});
	});

	test.describe('when doing multiple clicks', () => {
		test('it should validate the durations and start times', async ({
			page,
			getTimeline,
			waitForTicks,
		}) => {
			const clickMeButton = page.getByTestId('click-me-button');

			await expect(clickMeButton).toBeVisible();

			const box = await clickMeButton.boundingBox();
			const x = box!.x + box!.width / 2;
			const y = box!.y + box!.height / 2;

			// We need to dispatch all click events in "parallel"
			await Promise.all([
				page.mouse.click(x, y),
				page.mouse.click(x, y),
				page.mouse.click(x, y),
				page.mouse.click(x, y),
			]);

			// Before first click callback started
			const firstTickAt = await waitForTicks(1);

			// After slow operation inside onClick callback
			const secondTickAt = await waitForTicks(2);

			// After slow operation inside onClick callback
			await waitForTicks(12);

			const timeline = await getTimeline();
			const mouseClickEvents = await (timeline?.getEventsPerType('user-event:mouse-action') || [])
				// Sometimes, when there is a delay between the mousedown and mouseup
				// the browser may record this a "mousedown" event as well
				// there is no good way to tell playwright to avoid this delay
				// @ts-expect-error
				.filter(({ data }) => data?.eventName === 'click');

			expect(mouseClickEvents).toHaveLength(4);

			await test.step('all clicks have a similar start time', async () => {
				const startTimes = mouseClickEvents.map(({ startTime }) => startTime).sort();

				const first = startTimes[0];
				const last = startTimes[startTimes.length - 1];

				expect(Math.abs(last - first)).toBeLessThanOrEqual(30);
			});

			await test.step('all follow ups clicks duration should be bigger than the first click', async () => {
				const firstClickDuration = secondTickAt - firstTickAt;

				// @ts-expect-error
				const secondClickDuration = mouseClickEvents[1].data.duration;
				// @ts-expect-error
				const thirdClickDuration = mouseClickEvents[2].data.duration;
				// @ts-expect-error
				const lastClickDuration = mouseClickEvents[3].data.duration;

				expect(secondClickDuration).toBeGreaterThanOrEqual(firstClickDuration);
				expect(thirdClickDuration).toBeGreaterThanOrEqual(firstClickDuration);
				expect(lastClickDuration).toBeGreaterThanOrEqual(firstClickDuration);
			});
		});
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await expect(page.getByTestId('click-me-button')).toBeVisible();
		await expect(page).toBeAccessible();
	});
});

test.describe('Editor Metrics - Latency: keyboard events', () => {
	test.use({
		examplePage: 'latency-keyboard-events',
	});

	test.describe('when typing inside a text area', () => {
		test('it should track the input events', async ({ page, getTimeline, waitForTicks }) => {
			const textarea = page.getByTestId('type-me-textarea');

			await expect(textarea).toBeVisible();

			await textarea.click();

			await page.keyboard.type('!');

			const firstTickAt = await waitForTicks(1);
			const secondTickAt = await waitForTicks(2);

			await waitForTicks(3);

			const timeline = await getTimeline();
			const keyboardEvents = await timeline?.getEventsPerType('user-event:keyboard');

			const inputEvents = keyboardEvents?.filter(
				// @ts-expect-error
				({ data }) => data?.eventName === 'input',
			);

			const internalInputDuration = secondTickAt - firstTickAt;

			expect(inputEvents).toHaveLength(1);

			// @ts-expect-error
			expect(inputEvents[0].startTime).toBeLessThanOrEqual(firstTickAt);
			// @ts-expect-error
			expect(inputEvents[0].data?.duration).toBeGreaterThanOrEqual(internalInputDuration);
			// @ts-expect-error
			expect(inputEvents[0].data?.elementName).toEqual('textarea[data-testid="type-me-textarea"]');
			// @ts-expect-error
			expect(inputEvents[0].data?.eventName).toEqual('input');
		});
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await expect(page.getByTestId('type-me-textarea')).toBeVisible();
		await expect(page).toBeAccessible();
	});
});

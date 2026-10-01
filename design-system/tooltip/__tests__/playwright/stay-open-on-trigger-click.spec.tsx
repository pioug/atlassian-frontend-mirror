// The listeners run inside `page.evaluate`, in the browser, where `bind-event-listener` cannot be
// imported. Each page is thrown away after its test.
/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { expect, type Page, test } from '@af/integration-testing';

/**
 * Tooltip: `hasNewContentOnTriggerClick` on the top-layer code path.
 *
 * The tooltip is a `popover="hint"`. A press on the trigger light-dismisses
 * it, and nothing can cancel that. With the prop set, the tooltip calls
 * `showPopover()` again from the trigger's `pointerup`. Browsers run light
 * dismiss before they dispatch `pointerup`, so the re-show is in the same
 * task and the browser never paints the tooltip closed.
 *
 * The unit tests use a jsdom popover polyfill, so they cannot prove this
 * event order. This spec guards it in a real browser.
 *
 * See: `platform/packages/design-system/top-layer/notes/decisions/tooltip-stay-open-on-trigger-click.md`.
 */

const featureFlag = 'platform-dst-top-layer-tooltip';

async function visit(page: Page) {
	await page.visitExample<typeof import('../../examples/testing-stay-open-on-trigger-click.tsx')>(
		'design-system',
		'tooltip',
		'testing-stay-open-on-trigger-click',
		{ featureFlag },
	);
}

/**
 * Starts to record the tooltip state on every animation frame, from the next
 * `pointerdown` until `framesAfterClick` frames after the `click`. Each
 * sample is `open` (open and fully visible), `fading` (open but not fully
 * visible) or `closed`. Also records every `toggle` event on the tooltip.
 *
 * Why sample frames: `toggle` and `transitionrun` events are simpler to
 * record, but they only suggest what the browser painted. Frame samples are
 * the direct proof that no frame shows the tooltip closed or fading.
 */
async function startSampling(page: Page, popoverTestId: string) {
	await page.evaluate((testId) => {
		type Sample = 'open' | 'fading' | 'closed';
		const state: { samples: Sample[]; toggles: string[]; done: boolean } = {
			samples: [],
			toggles: [],
			done: false,
		};
		(window as unknown as { __stayOpenSampling: typeof state }).__stayOpenSampling = state;

		const getPopover = () => document.querySelector(`[data-testid="${testId}"]`);
		const sample = (): Sample => {
			const el = getPopover();
			if (!el || !el.matches(':popover-open')) {
				return 'closed';
			}
			return Number(getComputedStyle(el).opacity) === 1 ? 'open' : 'fading';
		};

		document.addEventListener(
			'toggle',
			(event) => {
				if (event.target === getPopover()) {
					const { oldState, newState } = event as Event & { oldState: string; newState: string };
					state.toggles.push(`${oldState}->${newState}`);
				}
			},
			{ capture: true },
		);

		const framesAfterClick = 20;
		let framesLeft = Infinity;
		window.addEventListener(
			'click',
			() => {
				framesLeft = framesAfterClick;
			},
			{ capture: true, once: true },
		);
		window.addEventListener(
			'pointerdown',
			() => {
				// Sample in the same task as the `pointerdown` as well, then on
				// every frame.
				state.samples.push(sample());
				const onFrame = () => {
					state.samples.push(sample());
					framesLeft -= 1;
					if (framesLeft > 0) {
						requestAnimationFrame(onFrame);
					} else {
						state.done = true;
					}
				};
				requestAnimationFrame(onFrame);
			},
			{ capture: true, once: true },
		);
	}, popoverTestId);
}

async function stopSampling(page: Page) {
	type Sampling = { __stayOpenSampling?: { samples: string[]; toggles: string[]; done: boolean } };
	await page.waitForFunction(
		() => (window as unknown as Sampling).__stayOpenSampling?.done === true,
	);
	return page.evaluate(() => {
		const sampling = (window as unknown as Sampling).__stayOpenSampling;
		return { samples: sampling?.samples ?? [], toggles: sampling?.toggles ?? [] };
	});
}

/**
 * Presses the mouse on the element's center. It waits a few frames between
 * `pointerdown` and `pointerup`, so the sampler sees frames on both sides of
 * the light dismiss.
 */
async function pressWithPause(page: Page, testId: string) {
	const box = await page.getByTestId(testId).boundingBox();
	if (!box) {
		throw new Error(`No bounding box for ${testId}`);
	}
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				let frames = 3;
				const onFrame = () => (--frames > 0 ? requestAnimationFrame(onFrame) : resolve());
				requestAnimationFrame(onFrame);
			}),
	);
	await page.mouse.up();
}

/**
 * Hovers the trigger and waits until the tooltip is open and fully visible.
 */
async function hoverUntilOpen(page: Page, testId: string) {
	await page.getByTestId(`${testId}--container`).hover();
	const popover = page.getByTestId(`${testId}--popover`);
	await expect(popover).toBeVisible();
	await expect(popover).toHaveCSS('opacity', '1');
	expect(await popover.evaluate((el) => el.matches(':popover-open'))).toBe(true);
}

test.describe('Tooltip: hasNewContentOnTriggerClick on the top-layer path', () => {
	test('a press on the trigger never paints the tooltip closed and shows the new content', async ({
		page,
	}) => {
		await visit(page);
		await hoverUntilOpen(page, 'stay-open');
		const popover = page.getByTestId('stay-open--popover');
		await expect(popover).toHaveText('Copy to clipboard');

		await startSampling(page, 'stay-open--popover');
		await pressWithPause(page, 'stay-open--container');
		const { samples, toggles } = await stopSampling(page);

		// Every frame from `pointerdown` to 20 frames after `click` is open and
		// fully visible: no closed frame and no restarted entry transition.
		expect(samples.length).toBeGreaterThan(20);
		expect(samples.filter((s) => s !== 'open')).toEqual([]);
		// The dismiss and the re-show are in one task, so `toggle` coalesces to
		// open -> open. A `->closed` toggle means a closed state was observable.
		expect(toggles.filter((t) => t.endsWith('->closed'))).toEqual([]);

		await expect(popover).toBeVisible();
		await expect(popover).toHaveText('Copied! (1)');
		expect(await popover.evaluate((el) => el.matches(':popover-open'))).toBe(true);

		// A second press behaves the same.
		await startSampling(page, 'stay-open--popover');
		await pressWithPause(page, 'stay-open--container');
		const second = await stopSampling(page);
		expect(second.samples.filter((s) => s !== 'open')).toEqual([]);
		await expect(popover).toHaveText('Copied! (2)');
	});

	test('the default tooltip still closes on a press on the trigger', async ({ page }) => {
		await visit(page);
		await hoverUntilOpen(page, 'default');

		await pressWithPause(page, 'default--container');

		await expect(page.getByTestId('default--popover')).toBeHidden();
	});

	test('Escape still closes the tooltip after a press on the trigger', async ({ page }) => {
		await visit(page);
		await hoverUntilOpen(page, 'stay-open');
		await pressWithPause(page, 'stay-open--container');
		const popover = page.getByTestId('stay-open--popover');
		await expect(popover).toHaveText('Copied! (1)');

		await page.keyboard.press('Escape');

		await expect(popover).toBeHidden();
	});
});

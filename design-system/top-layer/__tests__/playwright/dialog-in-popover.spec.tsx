/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners -- `page.evaluate` code runs in the page and cannot import `bind-event-listener` */
import { expect, type Page, test } from '@af/integration-testing';

type TMode = 'separate' | 'grouped';

type TLog = {
	cancelables: boolean[];
	// Painted frames where an open modal was inside the hidden popover (not visible, page inert).
	invisibleModalFrames: number;
};

type TEndState = {
	log: TLog;
	isPopoverOpen: boolean;
	isDialogInDom: boolean;
	isDialogOpen: boolean;
	modalCount: number;
	focusedTestId: string | null;
};

async function openDialogInPopover({ page, mode }: { page: Page; mode: TMode }) {
	await page.visitExample<typeof import('../../examples/167-testing-dialog-in-auto-popover.tsx')>(
		'design-system',
		'top-layer',
		'testing-dialog-in-auto-popover',
	);
	if (mode === 'grouped') {
		await page.getByTestId('grouped-trigger').click();
		await expect(page.getByTestId('manual-popover-button')).toBeVisible();
		return;
	}
	await page.getByTestId('separate-trigger').click();
	await expect(page.getByTestId('host-popover')).toBeVisible();
	await page.getByTestId('dialog-trigger').click();
	await expect(page.getByTestId('dialog')).toBeVisible();
	await page.getByTestId('manual-popover-trigger').click();
	await expect(page.getByTestId('manual-popover-button')).toBeVisible();
}

async function recordState({ page }: { page: Page }) {
	await page.evaluate(() => {
		const dialog = document.querySelector('dialog');
		const popover = document.querySelector('[data-testid="host-popover"]');
		if (!dialog || !popover) {
			throw new Error('No dialog or popover');
		}
		const log: TLog = { cancelables: [], invisibleModalFrames: 0 };
		dialog.addEventListener('cancel', (event) => log.cancelables.push(event.cancelable));
		const isModalInHiddenPopover = () =>
			Boolean(document.querySelector('dialog:modal')) && !popover.matches(':popover-open');
		// Seen at the start of a frame and still seen in the task after the frame, so the frame
		// painted it.
		const onFrame = () => {
			if (isModalInHiddenPopover()) {
				setTimeout(() => {
					if (isModalInHiddenPopover()) {
						log.invisibleModalFrames++;
					}
				}, 0);
			}
			requestAnimationFrame(onFrame);
		};
		requestAnimationFrame(onFrame);
		(window as unknown as { probeLog: TLog }).probeLog = log;
	});
}

function getEndState({ page }: { page: Page }): Promise<TEndState> {
	return page.evaluate(() => {
		const popover = document.querySelector('[data-testid="host-popover"]');
		const dialog = document.querySelector('dialog');
		return {
			log: (window as unknown as { probeLog: TLog }).probeLog,
			isPopoverOpen: Boolean(popover?.matches(':popover-open')),
			isDialogInDom: Boolean(dialog),
			isDialogOpen: Boolean(dialog?.open),
			modalCount: document.querySelectorAll('dialog:modal').length,
			focusedTestId: document.activeElement?.getAttribute('data-testid') ?? null,
		};
	});
}

/**
 * Dialog takes each Escape (focus is in a `manual` child popover, which does not take Escape), and
 * calls `preventDefault()`. So the browser makes no close request: no `cancel`, and the parent
 * `auto` popover does not close. The same in every browser, and in both close watcher groups.
 */
async function expectAskedPerPressAndNothingClosed({
	page,
	state,
	escapes,
}: {
	page: Page;
	state: TEndState;
	escapes: number;
}) {
	expect(state.log.cancelables).toEqual([]);
	expect(state.log.invisibleModalFrames).toBe(0);
	expect(state.isPopoverOpen).toBe(true);
	expect(state.isDialogInDom).toBe(true);
	expect(state.isDialogOpen).toBe(true);
	expect(state.modalCount).toBe(1);
	expect(state.focusedTestId).toBe('manual-popover-button');
	// One ask per key press. The dialog refuses each one, and nothing else closes.
	await expect(page.getByTestId('close-count')).toHaveText(String(escapes));
	await expect(page.getByTestId('popover-close-count')).toHaveText('0');
	await expect(page.getByTestId('exit-while-open-count')).toHaveText('0');
}

// Whether the element is on top at its centre, so a click reaches it (it is not inert or covered).
function isOnTop({ page, testId }: { page: Page; testId: string }): Promise<boolean> {
	return page.evaluate((id) => {
		const element = document.querySelector(`[data-testid="${id}"]`);
		if (!element) {
			throw new Error(`No element ${id}`);
		}
		const box = element.getBoundingClientRect();
		return (
			document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) === element
		);
	}, testId);
}

/**
 * The Forge case: a refusing Dialog inside an open `auto` popover, with focus in a `manual` child
 * popover. Before `closedby="none"`, each Escape reached the browser as a close request, and the
 * close-watcher rule (Chromium, Firefox 149+) made the later ones forced closes. Now Dialog takes
 * each Escape itself, so there is no close request and no forced close.
 * Nothing runs between the Escapes: Playwright's `page.evaluate` and `expect` grant user
 * activation, which would hide a close-watcher difference.
 */
test.describe('Dialog inside an auto popover - Escape in a manual child popover', () => {
	for (const mode of ['separate', 'grouped'] as const) {
		// eslint-disable-next-line playwright/expect-expect -- `expectAskedPerPressAndNothingClosed` asserts
		test(`back-to-back Escapes ask per press and close nothing (${mode} close watcher groups)`, async ({
			page,
		}) => {
			await openDialogInPopover({ page, mode });
			await page.getByTestId('manual-popover-button').focus();
			await recordState({ page });

			for (let i = 0; i < 10; i++) {
				await page.keyboard.press('Escape');
			}
			// Let any late close or exit run.
			await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 300)));

			const state = await getEndState({ page });
			await expectAskedPerPressAndNothingClosed({ page, state, escapes: 10 });
		});
	}

	// The refusing dialog stays open, so the page behind it stays inert, as for any open modal.
	test('after the Escapes the dialog and the popover stay open, and the page behind is inert', async ({
		page,
	}) => {
		await openDialogInPopover({ page, mode: 'separate' });
		await page.getByTestId('manual-popover-button').focus();
		await recordState({ page });
		for (let i = 0; i < 10; i++) {
			await page.keyboard.press('Escape');
		}

		await expect(page.getByTestId('close-count')).toHaveText('10');
		await expect(page.getByTestId('dialog')).toHaveAttribute('open', '');
		await expect(page.getByTestId('host-popover')).toBeVisible();
		await expect(page.getByTestId('exit-while-open-count')).toHaveText('0');
		expect(await isOnTop({ page, testId: 'separate-trigger' })).toBe(false);
	});
});

/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners -- `page.evaluate` code runs in the page and cannot import `bind-event-listener` */

import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Dialog takes the Escape `keydown`, so the browser makes no close request and never closes
// the `<dialog>` itself, even after many refused Escapes (the close-watcher rule in Chrome and
// Firefox 149+).
test.describe('Modal dialog: top-layer Escape never closes the dialog natively', () => {
	test('when onClose keeps the modal open', async ({ page }) => {
		await openModal({ page, trigger: 'refusing-trigger' });
		const focused = page.getByTestId('modal-body-button');
		await focused.focus();
		await recordDialogState({ page });

		await mashEscape({ page, onSpacedPress: (i) => expectCloseCount({ page, count: i }) });

		// A held key asks once: 5 + 20 + 1.
		await expectCloseCount({ page, count: 26 });
		await expectNeverClosed({ page, escapes: 45, focusedTestId: 'modal-body-button' });
		await expect(focused).toBeFocused();
	});

	test('when shouldCloseOnEscapePress is false', async ({ page }) => {
		await openModal({ page, trigger: 'escape-disabled-trigger' });
		const focused = page.getByTestId('modal-body-button');
		await focused.focus();
		await recordDialogState({ page });

		await mashEscape({ page, onSpacedPress: () => nextFrames({ page }) });

		await expectNeverClosed({ page, escapes: 45, focusedTestId: 'modal-body-button' });
		await expectCloseCount({ page, count: 0 });
		await expect(focused).toBeFocused();
	});

	// A click on the title moves focus to the `<dialog>`, so the modal still takes the Escape.
	test('after a click on the title', async ({ page }) => {
		await openModal({ page, trigger: 'refusing-trigger' });
		await page.getByText('Escape refused', { exact: true }).click();
		await expect(page.getByTestId('modal')).toBeFocused();
		await recordDialogState({ page });

		await mashEscape({ page, onSpacedPress: (i) => expectCloseCount({ page, count: i }) });

		await expectCloseCount({ page, count: 26 });
		await expectNeverClosed({ page, escapes: 45, focusedTestId: 'modal' });
	});

	test('a child popup takes the first Escape, the modal is asked the rest', async ({ page }) => {
		await openModal({ page, trigger: 'refusing-trigger' });
		await page.getByTestId('child-popup-trigger').click();
		await expect(page.getByTestId('child-popup-button')).toBeVisible();
		await page.getByTestId('child-popup-button').focus();
		await recordDialogState({ page });

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('child-popup-button')).toBeHidden();
		await expectCloseCount({ page, count: 0 });
		// Not every engine restores focus to the trigger, so focus a button.
		const focused = page.getByTestId('modal-body-button');
		await focused.focus();

		for (let i = 0; i < 20; i++) {
			await page.keyboard.press('Escape');
		}

		await expectCloseCount({ page, count: 20 });
		await expectNeverClosed({ page, escapes: 21, focusedTestId: 'modal-body-button', skip: 1 });
		await expect(focused).toBeFocused();
	});
});

// Focus on `<body>`: focus was last in the modal, so it takes the Escape and asks once per press,
// as legacy does. No close request, so the close-watcher rule (Chrome, Firefox 149+) never forces
// a close. Nothing runs between the Escapes: Playwright's `page.evaluate` and `expect` grant user
// activation, which would hide a forced close.
test('Modal dialog: top-layer Escape after the focused element is removed asks once per press', async ({
	page,
}) => {
	await openModal({ page, trigger: 'refusing-trigger' });
	await page.getByTestId('removable-button').focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('removable-button')).toHaveCount(0);
	await recordDialogState({ page });

	for (let i = 0; i < 20; i++) {
		await page.keyboard.press('Escape');
	}

	await expectCloseCount({ page, count: 20 });
	await expectNeverClosed({ page, escapes: 20 });
	expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
});

// As in Forge: the modal is inside an open popup. Escape closes only the modal.
test('Modal dialog: top-layer Escape in a modal inside a popup closes only the modal', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/104-testing-escape-refused.tsx')>(
		'design-system',
		'modal-dialog',
		'testing-escape-refused',
		{ featureFlag },
	);
	await page.getByTestId('host-popup-trigger').click();
	await page.getByTestId('hosted-modal-trigger').click();
	await expect(page.getByTestId('hosted-modal')).toBeVisible();
	await page.getByTestId('hosted-modal-button').focus();

	await page.keyboard.press('Escape');

	await expect(page.getByTestId('hosted-modal')).toHaveCount(0);
	await expect(page.getByTestId('host-popup-content')).toBeVisible();
	await expect(page.getByTestId('host-popup-close-count')).toHaveText('0');
});

// Unlike legacy: an Escape during the exit, with focus back on the trigger, does not call onClose
// again. The modal is already closing.
test('Modal dialog: top-layer Escape during the exit does not call onClose again', async ({
	page,
}) => {
	await openModal({ page, trigger: 'closing-trigger' });
	await page.getByTestId('modal-body-button').focus();
	// Hold the exit open, so the next Escape is during the exit.
	await page.addStyleTag({
		content: 'dialog, dialog::backdrop { animation-duration: 100s !important; }',
	});

	await page.keyboard.press('Escape');
	await expect(page.getByTestId('closing-trigger')).toBeFocused();
	await expect(page.getByTestId('modal')).toHaveCount(1);
	await page.keyboard.press('Escape');

	await expectCloseCount({ page, count: 1 });
});

// Unlike legacy: an Escape during a nested modal's exit, with focus back on its trigger in the
// outer modal, asks the outer modal. The nested modal is not asked again.
test('Modal dialog: top-layer Escape during a nested modal exit asks the outer modal', async ({
	page,
}) => {
	await openModal({ page, trigger: 'refusing-trigger' });
	await page.getByTestId('nested-modal-trigger').click();
	await expect(page.getByTestId('nested-modal')).toBeVisible();
	await page.getByTestId('nested-modal-button').focus();
	// Hold the exit open, so the next Escape is during the exit.
	await page.addStyleTag({
		content: 'dialog, dialog::backdrop { animation-duration: 100s !important; }',
	});

	await page.keyboard.press('Escape');
	await expect(page.getByTestId('nested-modal-trigger')).toBeFocused();
	await expect(page.getByTestId('nested-modal')).toHaveCount(1);
	await page.keyboard.press('Escape');

	await expectCloseCount({ page, count: 1 });
	await expect(page.getByTestId('nested-close-count')).toHaveText('1');
	// The outer modal refuses, so it stays open.
	await expect(page.getByTestId('modal')).toHaveAttribute('open', '');
});

async function openModal({ page, trigger }: { page: Page; trigger: string }) {
	await page.visitExample<typeof import('../../examples/104-testing-escape-refused.tsx')>(
		'design-system',
		'modal-dialog',
		'testing-escape-refused',
		{ featureFlag },
	);
	await page.getByTestId(trigger).click();
	await expect(page.getByTestId('modal')).toBeVisible();
}

async function expectCloseCount({ page, count }: { page: Page; count: number }) {
	await expect(page.getByTestId('close-count')).toHaveText(String(count));
}

async function nextFrames({ page }: { page: Page }) {
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
	);
}

// 5 spaced presses, then 20 back to back, then 20 held (repeated `keydown`, one `keyup`).
async function mashEscape({
	page,
	onSpacedPress,
}: {
	page: Page;
	onSpacedPress: (pressCount: number) => Promise<void>;
}) {
	for (let i = 1; i <= 5; i++) {
		await page.keyboard.press('Escape');
		await onSpacedPress(i);
	}
	for (let i = 0; i < 20; i++) {
		await page.keyboard.press('Escape');
	}
	for (let i = 0; i < 20; i++) {
		await page.keyboard.down('Escape');
	}
	await page.keyboard.up('Escape');
}

type TDialogLog = {
	escapes: number;
	// The Escape count when each `cancel` fired.
	cancelsAtEscape: number[];
	nativeCloses: number;
	closedToggles: number;
	closedSamples: number;
	focusedTestIds: (string | null)[];
};

// Records native close events, and samples `dialog.open` on every Escape and every frame.
async function recordDialogState({ page }: { page: Page }) {
	await page.evaluate(() => {
		const dialog = document.querySelector('dialog');
		if (!dialog) {
			throw new Error('No dialog');
		}
		const log: TDialogLog = {
			escapes: 0,
			cancelsAtEscape: [],
			nativeCloses: 0,
			closedToggles: 0,
			closedSamples: 0,
			focusedTestIds: [],
		};
		const sample = () => {
			if (!dialog.open) {
				log.closedSamples++;
			}
		};
		dialog.addEventListener('cancel', () => log.cancelsAtEscape.push(log.escapes));
		dialog.addEventListener('close', () => log.nativeCloses++);
		dialog.addEventListener('toggle', (event) => {
			if ((event as ToggleEvent).newState === 'closed') {
				log.closedToggles++;
			}
		});
		window.addEventListener(
			'keydown',
			(event) => {
				if (event.key === 'Escape') {
					log.escapes++;
					log.focusedTestIds.push(document.activeElement?.getAttribute('data-testid') ?? null);
					sample();
				}
			},
			true,
		);
		window.addEventListener('keyup', sample);
		const onFrame = () => {
			sample();
			requestAnimationFrame(onFrame);
		};
		requestAnimationFrame(onFrame);
		(window as unknown as { dialogLog: TDialogLog }).dialogLog = log;
	});
}

async function expectNeverClosed({
	page,
	escapes,
	focusedTestId,
	skip = 0,
}: {
	page: Page;
	escapes: number;
	focusedTestId?: string;
	skip?: number;
}) {
	const log = await page.evaluate(() => (window as unknown as { dialogLog: TDialogLog }).dialogLog);
	expect(log.escapes).toBe(escapes);
	// No close request after `skip`: ModalDialog took every Escape.
	expect(log.cancelsAtEscape.filter((escape) => escape > skip)).toEqual([]);
	expect(log.nativeCloses).toBe(0);
	expect(log.closedToggles).toBe(0);
	expect(log.closedSamples).toBe(0);
	if (focusedTestId) {
		expect(log.focusedTestIds.slice(skip)).toEqual(Array(escapes - skip).fill(focusedTestId));
	}
	await expect(page.getByTestId('modal')).toHaveAttribute('open', '');
}

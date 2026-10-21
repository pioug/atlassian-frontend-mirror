/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners -- `page.evaluate` code runs in the page and cannot import `bind-event-listener` */

import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

type TDialogLog = {
	escapes: number;
	cancels: number;
	nativeCloses: number;
	closedSamples: number;
	focusedTestIds: (string | null)[];
};

// Dialog takes the Escape `keydown`, so the browser makes no close request and never closes the
// `<dialog>` itself, even after many refused Escapes (the close-watcher rule in Chrome and
// Firefox 149+).
test('Drawer: top-layer Escape never closes the drawer natively when onClose keeps it open', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../examples/99-testing-escape-refused.tsx')>(
		'design-system',
		'drawer',
		'testing-escape-refused',
		{ featureFlag },
	);
	await page.getByTestId('drawer-trigger').click();
	await expect(page.getByTestId('drawer')).toBeVisible();
	const focused = page.getByTestId('drawer-button');
	await focused.focus();

	// Records native close events, and samples `dialog.open` on every Escape and every frame.
	await page.evaluate(() => {
		const dialog = document.querySelector('dialog');
		if (!dialog) {
			throw new Error('No dialog');
		}
		const log: TDialogLog = {
			escapes: 0,
			cancels: 0,
			nativeCloses: 0,
			closedSamples: 0,
			focusedTestIds: [],
		};
		const sample = () => {
			if (!dialog.open) {
				log.closedSamples++;
			}
		};
		dialog.addEventListener('cancel', () => log.cancels++);
		dialog.addEventListener('close', () => log.nativeCloses++);
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
		const onFrame = () => {
			sample();
			requestAnimationFrame(onFrame);
		};
		requestAnimationFrame(onFrame);
		(window as unknown as { dialogLog: TDialogLog }).dialogLog = log;
	});

	// Spaced, then 20 back to back, then 20 held (repeated `keydown`, one `keyup`).
	for (let i = 1; i <= 5; i++) {
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('close-count')).toHaveText(String(i));
	}
	for (let i = 0; i < 20; i++) {
		await page.keyboard.press('Escape');
	}
	for (let i = 0; i < 20; i++) {
		await page.keyboard.down('Escape');
	}
	await page.keyboard.up('Escape');

	// A held key asks once: 5 + 20 + 1.
	await expect(page.getByTestId('close-count')).toHaveText('26');
	const log = await page.evaluate(() => (window as unknown as { dialogLog: TDialogLog }).dialogLog);
	expect(log.escapes).toBe(45);
	expect(log.cancels).toBe(0);
	expect(log.nativeCloses).toBe(0);
	expect(log.closedSamples).toBe(0);
	expect(log.focusedTestIds).toEqual(Array(45).fill('drawer-button'));
	await expect(page.getByTestId('drawer')).toHaveAttribute('open', '');
	await expect(focused).toBeFocused();
});

// Unlike legacy: an Escape during the exit, with focus back on the trigger, does not call onClose
// again. The drawer is already closing.
test('Drawer: top-layer Escape during the exit does not call onClose again', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/99-testing-escape-refused.tsx')>(
		'design-system',
		'drawer',
		'testing-escape-refused',
		{ featureFlag },
	);
	await page.getByTestId('closing-drawer-trigger').click();
	await expect(page.getByTestId('closing-drawer')).toBeVisible();
	await page.getByTestId('closing-drawer-button').focus();
	// Hold the exit open, so the next Escape is during the exit.
	await page.addStyleTag({
		content: 'dialog, dialog::backdrop { animation-duration: 100s !important; }',
	});

	await page.keyboard.press('Escape');
	await expect(page.getByTestId('closing-drawer-trigger')).toBeFocused();
	await expect(page.getByTestId('closing-drawer')).toHaveCount(1);
	await page.keyboard.press('Escape');

	await expect(page.getByTestId('close-count')).toHaveText('1');
});

// A child popup takes the Escape. The drawer is asked on the next Escape and stays open.
test('Drawer: top-layer Escape in a child popup closes only the popup', async ({ page }) => {
	await openRefusingDrawer({ page });
	await page.getByTestId('child-popup-trigger').click();
	await expect(page.getByTestId('child-popup-button')).toBeVisible();
	await page.getByTestId('child-popup-button').focus();

	await page.keyboard.press('Escape');

	await expect(page.getByTestId('child-popup-button')).toBeHidden();
	await expect(page.getByTestId('close-count')).toHaveText('0');

	await page.getByTestId('drawer-button').focus();
	await page.keyboard.press('Escape');

	await expect(page.getByTestId('close-count')).toHaveText('1');
	await expect(page.getByTestId('drawer')).toHaveAttribute('open', '');
});

// Unlike legacy: an Escape during a nested drawer's exit, with focus back on its trigger in the
// outer drawer, asks the outer drawer. The nested drawer is not asked again.
test('Drawer: top-layer Escape during a nested drawer exit asks the outer drawer', async ({
	page,
}) => {
	await openRefusingDrawer({ page });
	await page.getByTestId('nested-drawer-trigger').click();
	await expect(page.getByTestId('nested-drawer')).toBeVisible();
	await page.getByTestId('nested-drawer-button').focus();
	// Hold the exit open, so the next Escape is during the exit.
	await page.addStyleTag({
		content: 'dialog, dialog::backdrop { animation-duration: 100s !important; }',
	});

	await page.keyboard.press('Escape');
	await expect(page.getByTestId('nested-drawer-trigger')).toBeFocused();
	await expect(page.getByTestId('nested-drawer')).toHaveCount(1);
	await page.keyboard.press('Escape');

	await expect(page.getByTestId('close-count')).toHaveText('1');
	await expect(page.getByTestId('nested-close-count')).toHaveText('1');
	// The outer drawer refuses, so it stays open.
	await expect(page.getByTestId('drawer')).toHaveAttribute('open', '');
});

async function openRefusingDrawer({ page }: { page: Page }) {
	await page.visitExample<typeof import('../../examples/99-testing-escape-refused.tsx')>(
		'design-system',
		'drawer',
		'testing-escape-refused',
		{ featureFlag },
	);
	await page.getByTestId('drawer-trigger').click();
	await expect(page.getByTestId('drawer')).toBeVisible();
}

/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners -- `page.evaluate` code runs in the page and cannot import `bind-event-listener` */

import { expect, type Page, test } from '@af/integration-testing';

test.describe('Dialog nested Escape handling', () => {
	test('Escape closes only the topmost dialog, not its ancestor', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await page.getByTestId('open-inner').click();
		await expect(page.getByTestId('outer-content')).toBeVisible();
		await expect(page.getByTestId('inner-content')).toBeVisible();

		await page.keyboard.press('Escape');

		// Only the inner (topmost) dialog closes; the outer stays open. Each Dialog takes only an
		// Escape for which it is the nearest dialog on the composed path.
		await expect(page.getByTestId('inner-content')).toBeHidden();
		await expect(page.getByTestId('outer-content')).toBeVisible();
		await expect(page.getByTestId('inner-close-count')).toHaveText('1');
		await expect(page.getByTestId('outer-close-count')).toHaveText('0');
	});

	// The inner dialog keeps itself open. Each press asks only the inner dialog, and neither
	// dialog closes natively.
	test('when the inner dialog refuses, only the inner dialog is asked', async ({ page }) => {
		await openNested({ page, innerTrigger: 'open-inner-refusing' });
		await page.getByTestId('close-inner').focus();
		await recordNativeCloses({ page });

		for (let i = 0; i < 20; i++) {
			await page.keyboard.press('Escape');
		}
		for (let i = 0; i < 20; i++) {
			await page.keyboard.down('Escape');
		}
		await page.keyboard.up('Escape');

		// A held key asks once: 20 + 1.
		await expect(page.getByTestId('inner-close-count')).toHaveText('21');
		await expect(page.getByTestId('outer-close-count')).toHaveText('0');
		await expect(page.getByTestId('inner-dialog')).toHaveAttribute('open', '');
		await expect(page.getByTestId('outer-dialog')).toHaveAttribute('open', '');
		await expect(page.getByTestId('close-inner')).toBeFocused();
		expect(await getNativeCloses({ page })).toEqual({ cancels: 0, closes: 0 });
	});

	// The first `keydown` closes the inner dialog and focus returns to the outer dialog. The
	// repeats are not a new press, so the outer dialog is not asked.
	test('a held Escape closes only the inner dialog', async ({ page }) => {
		await openNested({ page, innerTrigger: 'open-inner' });
		await page.getByTestId('close-inner').focus();

		for (let i = 0; i < 20; i++) {
			await page.keyboard.down('Escape');
		}
		await page.keyboard.up('Escape');

		await expect(page.getByTestId('inner-dialog')).toHaveCount(0);
		await expect(page.getByTestId('outer-dialog')).toHaveAttribute('open', '');
		await expect(page.getByTestId('inner-close-count')).toHaveText('1');
		await expect(page.getByTestId('outer-close-count')).toHaveText('0');
	});

	test('a second Escape then closes the outer dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await page.getByTestId('open-inner').click();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('inner-content')).toBeHidden();
		await expect(page.getByTestId('outer-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('outer-content')).toBeHidden();
	});

	test('Escape closes a single, non-nested dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await expect(page.getByTestId('outer-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('outer-content')).toBeHidden();
	});
});

async function openNested({ page, innerTrigger }: { page: Page; innerTrigger: string }) {
	await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
		'design-system',
		'top-layer',
		'testing-nested-dialog-escape',
	);
	await page.getByTestId('open-outer').click();
	await page.getByTestId(innerTrigger).click();
	await expect(page.getByTestId('inner-content')).toBeVisible();
}

type TNativeCloses = { cancels: number; closes: number };

// Counts `cancel` and `close` on both dialogs.
async function recordNativeCloses({ page }: { page: Page }) {
	await page.evaluate(() => {
		const log: TNativeCloses = { cancels: 0, closes: 0 };
		document.querySelectorAll('dialog').forEach((dialog) => {
			dialog.addEventListener('cancel', () => log.cancels++);
			dialog.addEventListener('close', () => log.closes++);
		});
		(window as unknown as { nativeCloses: TNativeCloses }).nativeCloses = log;
	});
}

function getNativeCloses({ page }: { page: Page }): Promise<TNativeCloses> {
	return page.evaluate(() => (window as unknown as { nativeCloses: TNativeCloses }).nativeCloses);
}

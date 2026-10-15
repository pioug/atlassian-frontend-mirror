/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { expect, test } from '@af/integration-testing';

// Native APIs and trusted input, without React or the testing polyfill.
// Each opening gets a separate user activation, matching nested popover interaction.
for (const { action, expectedParentOpen, expectedChildOpen } of [
	{ action: 'none', expectedParentOpen: true, expectedChildOpen: false },
	{ action: 'prevent', expectedParentOpen: true, expectedChildOpen: true },
	{ action: 'close', expectedParentOpen: false, expectedChildOpen: false },
	{ action: 'remove', expectedParentOpen: false, expectedChildOpen: false },
	{ action: 'reopen', expectedParentOpen: true, expectedChildOpen: false },
	{ action: 'replacement', expectedParentOpen: true, expectedChildOpen: false },
	{ action: 'manual', expectedParentOpen: false, expectedChildOpen: false },
	{ action: 'remove-attribute', expectedParentOpen: false, expectedChildOpen: false },
] as const) {
	test(`native Escape selects the layer after keydown: ${action}`, async ({ page }) => {
		await page.goto('about:blank');
		await page.setContent(`
			<title>Native Escape target selection</title>
			<button id="open-parent">Open parent</button>
			<div id="parent" popover="auto">
				<button id="open-child">Open child</button>
				<div id="child" popover="auto"><button id="action">Child action</button></div>
				<div id="replacement" popover="auto"><button>Replacement action</button></div>
			</div>
		`);
		await page.evaluate((action) => {
			function getElement(id: string) {
				const element = document.getElementById(id);
				if (!(element instanceof HTMLElement)) {
					throw new Error(`Missing fixture element: ${id}`);
				}
				return element;
			}
			const parent = getElement('parent');
			const child = getElement('child');
			const replacement = getElement('replacement');
			getElement('open-parent').addEventListener('click', () => parent.showPopover());
			getElement('open-child').addEventListener('click', () => {
				child.showPopover();
				getElement('action').focus();
			});
			child.addEventListener('keydown', (event) => {
				if (event.key !== 'Escape') {
					return;
				}
				if (action === 'prevent') {
					event.preventDefault();
				}
				if (action === 'close' || action === 'reopen' || action === 'replacement') {
					child.hidePopover();
				}
				if (action === 'remove') {
					child.remove();
				}
				if (action === 'reopen') {
					child.showPopover();
				}
				if (action === 'replacement') {
					replacement.showPopover();
				}
				if (action === 'manual') {
					child.setAttribute('popover', 'manual');
				}
				if (action === 'remove-attribute') {
					child.removeAttribute('popover');
				}
				document.body.dataset.childOpenAfterKeydown = String(child.matches(':popover-open'));
			});
		}, action);
		await page.getByRole('button', { name: 'Open parent', exact: true }).click();
		await page.getByRole('button', { name: 'Open child', exact: true }).click();
		await page.keyboard.press('Escape');
		await expect
			.poll(() =>
				page.evaluate(() => ({
					parent: document.getElementById('parent')?.matches(':popover-open') ?? false,
					child: document.getElementById('child')?.matches(':popover-open') ?? false,
					replacement: document.getElementById('replacement')?.matches(':popover-open') ?? false,
				})),
			)
			.toEqual({ parent: expectedParentOpen, child: expectedChildOpen, replacement: false });
		expect(await page.evaluate(() => document.body.dataset.childOpenAfterKeydown)).toBe(
			String(action === 'none' || action === 'prevent' || action === 'reopen'),
		);
	});
}

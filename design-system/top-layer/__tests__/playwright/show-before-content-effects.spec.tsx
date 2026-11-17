import { expect, type Page, test } from '@af/integration-testing';

/**
 * A layer shows (`showPopover()`, `showModal()`) before its content effects run: `autoFocus`, ref
 * callbacks and layout effects (`internal/sync-native-open/use-sync-native-open.tsx`). So a content
 * `focus()` call lands on a visible layer, and a measurement at mount sees real sizes. Before, the
 * layer showed after the content effects, so the browser ignored those `focus()` calls and the
 * measurements were zero.
 *
 * Initial focus does nothing when focus is already inside the layer. The order is: the content's own
 * focus, then an `[autofocus]` element (also one that the content sets in a ref callback), then
 * `initialFocusRef`, then the role default.
 *
 * See `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */

type TLayerKind = 'popover-dialog' | 'popover-menu' | 'popover-no-role' | 'dialog';

type TFocusCall =
	| 'none'
	| 'autofocus-input'
	| 'autofocus-button'
	| 'autofocus-textarea'
	| 'autofocus-select'
	| 'ref-callback'
	| 'layout-effect';

type TSettings = {
	layerKind?: TLayerKind;
	focusCall?: TFocusCall;
	mode?: 'auto' | 'manual';
	mountStyle?: 'is-open-prop' | 'conditional';
	hasInitialFocusRef?: boolean;
	hasAutofocusAttribute?: boolean;
	isInitialAutoFocusDisabled?: boolean;
	isStrictMode?: boolean;
	shouldAnimate?: boolean;
};

const layerKinds: readonly TLayerKind[] = [
	'popover-dialog',
	'popover-menu',
	'popover-no-role',
	'dialog',
];

const contentFocusCalls: readonly TFocusCall[] = [
	'autofocus-input',
	'autofocus-button',
	'autofocus-textarea',
	'autofocus-select',
	'ref-callback',
	'layout-effect',
];

// A menu can hold only menu items, so it gets the focus calls on a button.
const menuFocusCalls: readonly TFocusCall[] = ['autofocus-button', 'ref-callback', 'layout-effect'];

function getContentFocusCalls({ layerKind }: { layerKind: TLayerKind }): readonly TFocusCall[] {
	if (layerKind === 'popover-menu') {
		return menuFocusCalls;
	}
	return contentFocusCalls;
}

// A React `autoFocus` call that the layer can hold.
function getAutoFocusCall({ layerKind }: { layerKind: TLayerKind }): TFocusCall {
	if (layerKind === 'popover-menu') {
		return 'autofocus-button';
	}
	return 'autofocus-input';
}

// The element that has focus after the open when the content does not move focus.
const roleDefaultTestIds: Readonly<Record<TLayerKind, string>> = {
	'popover-dialog': 'first',
	'popover-menu': 'first',
	'popover-no-role': 'trigger',
	dialog: 'first',
};

async function visit({ page }: { page: Page }) {
	await page.visitExample<
		typeof import('../../examples/171-testing-show-before-content-effects.tsx')
	>('design-system', 'top-layer', 'testing-show-before-content-effects');
}

async function visitWithSettings({ page, settings }: { page: Page; settings: TSettings }) {
	await visit({ page });
	const selects = [
		{ testId: 'layer-kind', value: settings.layerKind },
		{ testId: 'focus-call', value: settings.focusCall },
		{ testId: 'mode', value: settings.mode },
		{ testId: 'mount-style', value: settings.mountStyle },
	];
	for (const { testId, value } of selects) {
		if (value) {
			await page.getByTestId(testId).selectOption(value);
		}
	}
	const checkboxes = [
		{ testId: 'has-initial-focus-ref', isChecked: settings.hasInitialFocusRef },
		{ testId: 'has-autofocus-attribute', isChecked: settings.hasAutofocusAttribute },
		{ testId: 'is-initial-auto-focus-disabled', isChecked: settings.isInitialAutoFocusDisabled },
		{ testId: 'is-strict-mode', isChecked: settings.isStrictMode },
		{ testId: 'should-animate', isChecked: settings.shouldAnimate },
	];
	for (const { testId, isChecked } of checkboxes) {
		if (isChecked) {
			await page.getByTestId(testId).check();
		}
	}
}

// From the keyboard, so the trigger has focus before the open in every browser.
async function openFromTrigger({ page }: { page: Page }) {
	await page.getByTestId('trigger').press('Enter');
	await expect(page.getByTestId('content')).toBeVisible();
}

// Whether the topmost element at the center of `from` is inside `inside`.
async function isHitInside({
	page,
	from,
	inside,
}: {
	page: Page;
	from: string;
	inside: string;
}): Promise<boolean> {
	const container = await page.getByTestId(inside).elementHandle();
	return page.getByTestId(from).evaluate((element, containerElement) => {
		const box = element.getBoundingClientRect();
		const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
		return hit !== null && containerElement !== null && containerElement.contains(hit);
	}, container);
}

test.describe('Show before content effects: focus calls in the content', () => {
	for (const layerKind of layerKinds) {
		for (const focusCall of getContentFocusCalls({ layerKind })) {
			test(`${layerKind}: ${focusCall} takes focus`, async ({ page }) => {
				await visitWithSettings({ page, settings: { layerKind, focusCall } });

				await openFromTrigger({ page });

				await expect(page.getByTestId('target')).toBeFocused();
			});
		}

		test(`${layerKind}: with no content focus, the role default applies`, async ({ page }) => {
			await visitWithSettings({ page, settings: { layerKind } });

			await openFromTrigger({ page });

			await expect(page.getByTestId(roleDefaultTestIds[layerKind])).toBeFocused();
		});

		test(`${layerKind}: Escape returns focus to the trigger after the content took focus`, async ({
			page,
			browserName,
		}) => {
			// Already fails on master: in WebKit, `dialog.close()` right after the open leaves focus on
			// `<body>` (`dialog.spec.tsx` "focus returns to trigger on Escape (keyboard)").
			test.fixme(
				layerKind === 'dialog' && browserName === 'webkit',
				'WebKit does not return focus when a dialog closes right after it opens',
			);
			await visitWithSettings({
				page,
				settings: { layerKind, focusCall: getAutoFocusCall({ layerKind }) },
			});
			await openFromTrigger({ page });
			await expect(page.getByTestId('target')).toBeFocused();

			await page.keyboard.press('Escape');

			await expect(page.getByTestId('content')).toBeHidden();
			await expect(page.getByTestId('trigger')).toBeFocused();
		});
	}

	test('popover-dialog: the content also takes focus when the layer mounts open', async ({
		page,
	}) => {
		await visitWithSettings({
			page,
			settings: { focusCall: 'autofocus-input', mountStyle: 'conditional' },
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
	});

	test('dialog: the content also takes focus when the layer mounts open', async ({ page }) => {
		await visitWithSettings({
			page,
			settings: { layerKind: 'dialog', focusCall: 'autofocus-input', mountStyle: 'conditional' },
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
	});
});

test.describe('Show before content effects: initial focus precedence', () => {
	for (const layerKind of ['popover-dialog', 'popover-menu'] as const) {
		test(`${layerKind}: the content focus wins over initialFocusRef`, async ({ page }) => {
			await visitWithSettings({
				page,
				settings: {
					layerKind,
					focusCall: getAutoFocusCall({ layerKind }),
					hasInitialFocusRef: true,
				},
			});

			await openFromTrigger({ page });

			await expect(page.getByTestId('target')).toBeFocused();
		});
	}

	test('popover-dialog: with no content focus, initialFocusRef wins over the role default', async ({
		page,
	}) => {
		await visitWithSettings({ page, settings: { hasInitialFocusRef: true } });

		await openFromTrigger({ page });

		await expect(page.getByTestId('initial-focus-ref-target')).toBeFocused();
	});

	test('popover-dialog: an autofocus attribute wins over initialFocusRef, on the open and on a reopen during the exit', async ({
		page,
	}) => {
		await visitWithSettings({
			page,
			settings: { hasInitialFocusRef: true, hasAutofocusAttribute: true, shouldAnimate: true },
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('autofocus-attribute')).toBeFocused();

		// The host stays mounted during the exit, so the attribute is there when it shows again.
		await page.getByTestId('reopen-during-exit').press('Enter');

		await expect(page.getByTestId('content')).toBeVisible();
		await expect(page.getByTestId('autofocus-attribute')).toBeFocused();
	});
});

test.describe('Show before content effects: an autofocus attribute that the content sets in a ref callback', () => {
	for (const layerKind of layerKinds) {
		test(`${layerKind}: the element with the attribute takes focus`, async ({ page }) => {
			await visitWithSettings({ page, settings: { layerKind, hasAutofocusAttribute: true } });

			await openFromTrigger({ page });

			await expect(page.getByTestId('autofocus-attribute')).toBeFocused();
		});

		for (const focusCall of [getAutoFocusCall({ layerKind }), 'layout-effect'] as const) {
			test(`${layerKind}: ${focusCall} in the content wins over the attribute`, async ({
				page,
			}) => {
				await visitWithSettings({
					page,
					settings: { layerKind, focusCall, hasAutofocusAttribute: true },
				});

				await openFromTrigger({ page });

				await expect(page.getByTestId('target')).toBeFocused();
			});
		}
	}
});

test.describe('Show before content effects: UNSAFE__disableInitialAutoFocus', () => {
	test('popover-dialog: initial focus does not move focus', async ({ page }) => {
		await visitWithSettings({ page, settings: { isInitialAutoFocusDisabled: true } });

		await openFromTrigger({ page });

		await expect(page.getByTestId('trigger')).toBeFocused();
	});

	test('popover-dialog: the content autoFocus still takes focus', async ({ page }) => {
		await visitWithSettings({
			page,
			settings: { focusCall: 'autofocus-input', isInitialAutoFocusDisabled: true },
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
	});

	test('popover-menu: a content focus() in a layout effect still takes focus', async ({ page }) => {
		await visitWithSettings({
			page,
			settings: {
				layerKind: 'popover-menu',
				focusCall: 'layout-effect',
				isInitialAutoFocusDisabled: true,
			},
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
	});
});

/**
 * The element with focus after a close and a reopen in the same task (see `set-initial-focus.tsx`).
 * A dialog, and an `auto` popover in Chromium and Firefox, return focus to the trigger on the close,
 * so the reopen takes initial focus. React does not run `autoFocus` again on mounted content, so
 * the role default applies. In WebKit an `auto` popover does not return focus, so focus stays on the
 * pressed item.
 */
function getFocusAfterSameTaskReopen({
	layerKind,
	browserName,
}: {
	layerKind: TLayerKind;
	browserName: string;
}): string {
	if (layerKind !== 'dialog' && browserName === 'webkit') {
		return 'reopen-during-exit';
	}
	return 'first';
}

test.describe('Show before content effects: reopen during the exit', () => {
	for (const layerKind of ['popover-menu', 'dialog'] as const) {
		test(`${layerKind}: the layer shows again with focus inside`, async ({ page, browserName }) => {
			await visitWithSettings({
				page,
				settings: { layerKind, focusCall: getAutoFocusCall({ layerKind }), shouldAnimate: true },
			});
			await openFromTrigger({ page });
			await expect(page.getByTestId('target')).toBeFocused();
			// Marks the host, to check that the reopen keeps the same element.
			await page.getByTestId('layer').evaluate((element) => {
				element.setAttribute('data-test-first-host', '');
			});

			await page.getByTestId('reopen-during-exit').press('Enter');

			await expect(page.getByTestId('content')).toBeVisible();
			await expect(page.getByTestId('layer')).toHaveAttribute('data-test-first-host', '');
			await expect(
				page.getByTestId(getFocusAfterSameTaskReopen({ layerKind, browserName })),
			).toBeFocused();
		});
	}

	test('popover-menu, manual mode: focus that the close left inside stays there', async ({
		page,
	}) => {
		await visitWithSettings({
			page,
			settings: {
				layerKind: 'popover-menu',
				focusCall: 'autofocus-button',
				mode: 'manual',
				shouldAnimate: true,
			},
		});
		await openFromTrigger({ page });
		await expect(page.getByTestId('target')).toBeFocused();

		// A manual popover does not return focus on close in any browser, so focus is still on this
		// button when the layer shows again in the same task.
		await page.getByTestId('reopen-during-exit').press('Enter');

		await expect(page.getByTestId('content')).toBeVisible();
		await expect(page.getByTestId('reopen-during-exit')).toBeFocused();
	});
});

test.describe('Show before content effects: measurement at mount', () => {
	for (const layerKind of ['popover-dialog', 'dialog'] as const) {
		test(`${layerKind}: a ref callback and a layout effect in the content measure the shown layer`, async ({
			page,
		}) => {
			await visitWithSettings({ page, settings: { layerKind } });

			await openFromTrigger({ page });

			const measured = page.getByTestId('measured');
			const size = await measured.evaluate((element) => {
				const { width, height } = element.getBoundingClientRect();
				return `${width}x${height}`;
			});
			expect(size).not.toBe('0x0');
			await expect(measured).toHaveAttribute('data-layout-effect-size', size);
			await expect(measured).toHaveAttribute('data-ref-callback-size', size);
		});
	}
});

test.describe('Show before content effects: nested layers that open in one commit', () => {
	for (const scenario of [
		'popover-popover',
		'dialog-popover',
		'popover-dialog',
		'dialog-dialog',
	] as const) {
		test(`${scenario}: the nested layer is on top, takes initial focus, and returns focus into its parent`, async ({
			page,
		}) => {
			await visit({ page });

			await page.getByTestId(`mount-nested-${scenario}`).click();

			await expect(page.getByTestId('nested-content')).toBeVisible();
			expect(await isHitInside({ page, from: 'parent-content', inside: 'nested-content' })).toBe(
				true,
			);
			await expect(page.getByTestId('nested-first')).toBeFocused();

			await page.getByTestId('nested-close').press('Enter');

			await expect(page.getByTestId('nested-content')).toBeHidden();
			await expect(page.getByTestId('parent-content')).toBeVisible();
			await expect(page.getByTestId('parent-first')).toBeFocused();
		});
	}

	test('dialog-portalled-dialog: a layer outside its parent in the DOM does not wait, and shows on top', async ({
		page,
	}) => {
		await visit({ page });

		await page.getByTestId('mount-nested-dialog-portalled-dialog').click();

		await expect(page.getByTestId('nested-content')).toBeVisible();
		expect(await isHitInside({ page, from: 'parent-content', inside: 'nested-content' })).toBe(
			true,
		);
		await expect(page.getByTestId('nested-first')).toBeFocused();

		await page.getByTestId('nested-close').press('Enter');

		await expect(page.getByTestId('nested-content')).toBeHidden();
		await expect(page.getByTestId('parent-first')).toBeFocused();
	});
});

test.describe('Show before content effects: React StrictMode', () => {
	test('manual popover that mounts open: the content autoFocus keeps focus, and close and reopen work', async ({
		page,
	}) => {
		await visitWithSettings({
			page,
			settings: {
				mode: 'manual',
				focusCall: 'autofocus-input',
				mountStyle: 'conditional',
				isStrictMode: true,
			},
		});

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
		await expect(page.getByTestId('close-requests')).toHaveText('0');

		await page.getByTestId('close').press('Enter');

		await expect(page.getByTestId('content')).toBeHidden();

		await openFromTrigger({ page });

		await expect(page.getByTestId('target')).toBeFocused();
	});

	/**
	 * The StrictMode cleanup hides the layer, which returns focus to the trigger, and React does not run
	 * `autoFocus` again. The second show is not a reopen, so the layer puts focus back where it was when
	 * it hid.
	 */
	for (const layerKind of ['popover-dialog', 'dialog'] as const) {
		test(`${layerKind} that mounts open: the content autoFocus keeps focus, and close and reopen work`, async ({
			page,
		}) => {
			await visitWithSettings({
				page,
				settings: {
					layerKind,
					focusCall: 'autofocus-input',
					mountStyle: 'conditional',
					isStrictMode: true,
				},
			});

			await openFromTrigger({ page });

			await expect(page.getByTestId('target')).toBeFocused();
			await expect(page.getByTestId('close-requests')).toHaveText('0');

			await page.keyboard.press('Escape');

			await expect(page.getByTestId('content')).toBeHidden();
			await expect(page.getByTestId('trigger')).toBeFocused();

			await openFromTrigger({ page });

			await expect(page.getByTestId('target')).toBeFocused();
		});
	}

	// StrictMode runs the effects again only for components that mount. The layer stays rendered
	// here, so its show effect does not run again, and the content keeps focus.
	for (const layerKind of ['popover-dialog', 'dialog'] as const) {
		test(`${layerKind} opened by isOpen: the content autoFocus keeps focus`, async ({ page }) => {
			await visitWithSettings({
				page,
				settings: { layerKind, focusCall: 'autofocus-input', isStrictMode: true },
			});

			await openFromTrigger({ page });

			await expect(page.getByTestId('target')).toBeFocused();
			await expect(page.getByTestId('close-requests')).toHaveText('0');
		});
	}
});

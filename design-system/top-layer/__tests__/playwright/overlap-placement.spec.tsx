import { expect, type Page, test } from '@af/integration-testing';

/**
 * Maximum allowed difference in CSS pixels for geometry assertions.
 */
const TOLERANCE = 2;

/**
 * Opens the inline editor example in a fixed viewport and waits for its dialog.
 */
async function openExample({
	page,
	params = {},
}: {
	page: Page;
	params?: Record<string, string | boolean>;
}) {
	await page.setViewportSize({ width: 1000, height: 700 });
	await page.visitExample<typeof import('../../examples/171-testing-popover-overlap')>(
		'design-system',
		'top-layer',
		'testing-popover-overlap',
		{ padding: false, ...params },
	);
	await page.getByTestId('overlap-anchor').getByRole('button').click();
	await expect(page.getByRole('dialog')).toBeVisible();
}

/**
 * Reads the anchor and popover bounds after both elements have layout.
 */
async function getGeometry({
	page,
	anchorTestId = 'overlap-anchor',
}: {
	page: Page;
	anchorTestId?: string;
}) {
	const anchor = await page.getByTestId(anchorTestId).boundingBox();
	const popover = await page.getByRole('dialog').boundingBox();
	if (!anchor || !popover) {
		throw new Error('The open example must have an anchor and a popover');
	}
	return { anchor, popover };
}

/**
 * Returns the larger of the editor's vertical centering error and logical text-start error.
 */
async function getFieldAlignmentDifference({ page }: { page: Page }) {
	return page.getByRole('textbox').evaluate((field) => {
		const anchor = document.querySelector('[data-testid="overlap-anchor"]');
		const trigger = anchor?.querySelector('button');
		if (!(field instanceof HTMLInputElement) || !anchor || !trigger) {
			throw new Error('The editor must have an input and a cell trigger');
		}
		const range = document.createRange();
		range.selectNodeContents(trigger);
		const text = range.getBoundingClientRect();
		const input = field.getBoundingClientRect();
		const cell = anchor.getBoundingClientRect();
		const style = getComputedStyle(field);
		const textStart = style.direction === 'rtl' ? text.right : text.left;
		const inputStart =
			style.direction === 'rtl'
				? input.right - parseFloat(style.paddingRight)
				: input.left + parseFloat(style.paddingLeft);
		return Math.max(
			Math.abs(cell.y + cell.height / 2 - input.y - input.height / 2),
			Math.abs(textStart - inputStart),
		);
	});
}

test.describe('native CSS overlap', () => {
	test.beforeEach(async ({ page }) => {
		const supportsOverlap = await page.evaluate(
			() =>
				CSS.supports('anchor-name', '--a') &&
				CSS.supports('min-inline-size', 'anchor-size(self-inline)'),
		);
		test.fixme(!supportsOverlap, 'Requires native CSS anchor positioning and sizing');
	});

	test('the inline editor overlaps the cell and matches its width', async ({ page }) => {
		await openExample({ page });
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				return Math.max(
					Math.abs(anchor.x - popover.x),
					Math.abs(anchor.y - popover.y),
					Math.abs(anchor.width - popover.width),
				);
			})
			.toBeLessThanOrEqual(TOLERANCE);
	});

	(['ltr', 'rtl'] as const).forEach((direction) =>
		test(`pads the editor while keeping its input aligned in ${direction}`, async ({ page }) => {
			await openExample({ page, params: { padding: true, direction } });
			const { popover } = await getGeometry({ page });
			const field = await page.getByRole('textbox').evaluate((element) => {
				const bounds = element.getBoundingClientRect();
				return { x: bounds.x, width: bounds.width };
			});
			expect(field.x - popover.x).toBeGreaterThan(6);
			expect(popover.x + popover.width - field.x - field.width).toBeGreaterThan(6);
			await expect.poll(() => getFieldAlignmentDifference({ page })).toBeLessThanOrEqual(TOLERANCE);
		}),
	);

	(['ltr', 'rtl'] as const).forEach((direction) =>
		test(`end-aligns a wider table editor in ${direction}`, async ({ page }) => {
			await openExample({ page, params: { wide: true, direction } });
			await expect
				.poll(async () => {
					const { anchor, popover } = await getGeometry({ page });
					expect(popover.width).toBeGreaterThan(anchor.width + 50);
					const anchorEnd = direction === 'rtl' ? anchor.x : anchor.x + anchor.width;
					const popoverEnd = direction === 'rtl' ? popover.x : popover.x + popover.width;
					return Math.abs(anchorEnd - popoverEnd);
				})
				.toBeLessThanOrEqual(TOLERANCE);
		}),
	);

	test('repositions when the editor grows and when its column is resized', async ({ page }) => {
		await openExample({ page, params: { padding: true } });
		const before = await getGeometry({ page });

		await page.getByRole('button', { name: 'Toggle validation' }).click();
		await expect
			.poll(async () => (await getGeometry({ page })).popover.height)
			.toBeGreaterThan(before.popover.height + 10);
		await expect.poll(() => getFieldAlignmentDifference({ page })).toBeLessThanOrEqual(TOLERANCE);

		await page.getByRole('button', { name: 'Resize column' }).click();
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				expect(anchor.width).toBeGreaterThan(before.anchor.width + 50);
				return Math.abs(anchor.width - popover.width);
			})
			.toBeLessThanOrEqual(TOLERANCE);
		await expect.poll(() => getFieldAlignmentDifference({ page })).toBeLessThanOrEqual(TOLERANCE);
	});

	test('accepts unitless string zero on both axes', async ({ page }) => {
		await openExample({ page, params: { inlineOffset: '0', blockOffset: '0' } });
		const { anchor, popover } = await getGeometry({ page });
		expect(Math.abs(anchor.x - popover.x)).toBeLessThanOrEqual(TOLERANCE);
		expect(Math.abs(anchor.y - popover.y)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('applies a backwards cross-axis shift to inline overlap placement', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/112-testing-popover-positioning')>(
			'design-system',
			'top-layer',
			'testing-popover-positioning',
			{
				axis: 'inline',
				edge: 'overlap-end',
				align: 'start',
				shift: '13',
				shiftDirection: 'backwards',
			},
		);
		await page.getByTestId('popover-trigger').click();
		const { anchor, popover } = await getGeometry({ page, anchorTestId: 'popover-trigger' });
		expect(Math.abs(anchor.x + anchor.width - popover.x - popover.width)).toBeLessThanOrEqual(
			TOLERANCE,
		);
		expect(Math.abs(anchor.y - 13 - popover.y)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('follows the cell during scrolling', async ({ page }) => {
		await openExample({ page });

		const before = await getGeometry({ page });
		await page.getByTestId('overlap-scroll-container').evaluate((container) => {
			container.scrollTop = 20;
		});
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				expect(anchor.y).toBeLessThan(before.anchor.y);
				return Math.max(Math.abs(anchor.x - popover.x), Math.abs(anchor.y - popover.y));
			})
			.toBeLessThanOrEqual(TOLERANCE);
	});

	test('supports inline-center and block-end alignment', async ({ page }) => {
		await openExample({
			page,
			params: { wide: true, inlineAlign: 'center', blockAlign: 'end' },
		});
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				expect(popover.width).toBeGreaterThan(anchor.width + 50);
				return Math.max(
					Math.abs(anchor.x + anchor.width / 2 - popover.x - popover.width / 2),
					Math.abs(anchor.y + anchor.height - popover.y - popover.height),
				);
			})
			.toBeLessThanOrEqual(TOLERANCE);
	});

	(['ltr', 'rtl'] as const).forEach((direction) => {
		(['start', 'center', 'end'] as const).forEach((align) => {
			test(`applies signed offsets with ${align} alignment in ${direction}`, async ({ page }) => {
				await openExample({
					page,
					params: {
						wide: true,
						direction,
						inlineAlign: align,
						blockAlign: align,
						inlineOffset: '13px',
						blockOffset: '-7px',
					},
				});
				await expect
					.poll(async () => {
						const { anchor, popover } = await getGeometry({ page });
						const inlineFraction =
							align === 'center' ? 0.5 : Number((align === 'end') !== (direction === 'rtl'));
						const blockFraction = align === 'center' ? 0.5 : Number(align === 'end');
						return Math.max(
							Math.abs(
								popover.x -
									anchor.x -
									(anchor.width - popover.width) * inlineFraction -
									(direction === 'rtl' ? -13 : 13),
							),
							Math.abs(popover.y - anchor.y - (anchor.height - popover.height) * blockFraction + 7),
						);
					})
					.toBeLessThanOrEqual(TOLERANCE);
			});
		});
	});

	test('tracks padding and border changes without a content-box resize', async ({ page }) => {
		await openExample({ page, params: { blockAlign: 'center' } });
		await page.getByTestId('overlap-anchor').evaluate((anchor) => {
			anchor.style.boxSizing = 'content-box';
			anchor.style.inlineSize = '180px';
		});
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				return Math.abs(anchor.width - popover.width);
			})
			.toBeLessThanOrEqual(TOLERANCE);
		const before = await getGeometry({ page });
		await page.getByTestId('overlap-anchor').evaluate((anchor) => {
			anchor.style.paddingInline = '12px';
			anchor.style.borderInline = '3px solid transparent';
		});
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				expect(anchor.width).toBeGreaterThan(before.anchor.width + 20);
				return Math.abs(anchor.width - popover.width);
			})
			.toBeLessThanOrEqual(TOLERANCE);
		const beforePadding = await getGeometry({ page });
		await page.getByRole('dialog').evaluate((popover) => {
			popover.style.paddingBlock = '12px';
		});
		await expect
			.poll(async () => {
				const { anchor, popover } = await getGeometry({ page });
				expect(popover.height).toBeGreaterThan(beforePadding.popover.height + 20);
				return Math.abs(anchor.y + anchor.height / 2 - popover.y - popover.height / 2);
			})
			.toBeLessThanOrEqual(TOLERANCE);
	});

	test('reveals the same popup after closing and reopening within one frame', async ({ page }) => {
		await openExample({ page });
		const popover = page.getByTestId('overlap-popover');
		await expect(popover).toHaveCSS('opacity', '1');
		await popover.evaluate((element: HTMLElement) => {
			element.hidePopover();
			element.showPopover();
		});
		await expect(popover).toBeVisible();
		await expect(popover).toHaveCSS('opacity', '1');
	});

	(['start', 'end'] as const).forEach((edge) =>
		test(`clamps offset overlays at the ${edge} viewport edges`, async ({ page }) => {
			await openExample({
				page,
				params: {
					nearEdge: edge,
					inlineAlign: edge === 'start' ? 'end' : 'start',
					blockAlign: 'center',
					inlineOffset: edge === 'start' ? '-120px' : '120px',
					blockOffset: edge === 'start' ? '-120px' : '120px',
				},
			});

			await expect
				.poll(async () => {
					const { popover } = await getGeometry({ page });
					return Math.max(
						0,
						popover.x + popover.width - 1000,
						popover.y + popover.height - 700,
						-popover.x,
						-popover.y,
					);
				})
				.toBeLessThanOrEqual(TOLERANCE);
			const { anchor, popover } = await getGeometry({ page });
			expect(popover.y).toBeLessThan(anchor.y + anchor.height);
			expect(popover.y + popover.height).toBeGreaterThan(anchor.y);
		}),
	);

	test('supports editing and Escape dismissal with focus returned to the trigger', async ({
		page,
	}) => {
		await openExample({ page });
		await page.getByRole('textbox', { name: 'Edit field' }).fill('Updated summary');
		await page.getByRole('button', { name: 'Save', exact: true }).click();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page.getByTestId('overlap-anchor').getByRole('button')).toHaveText(
			'Updated summary',
		);

		// Safari does not focus a button on pointer click. Open with the keyboard to test focus return.
		await page.getByTestId('overlap-anchor').getByRole('button').focus();
		await page.keyboard.press('Enter');
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page.getByTestId('overlap-anchor').getByRole('button')).toBeFocused();
	});
});

test('an animated overlap child does not inherit its parent’s slide', async ({ page }) => {
	await page.visitExample<typeof import('../../examples/94-testing-nested-popovers')>(
		'design-system',
		'top-layer',
		'testing-nested-popovers',
		{ animate: true },
	);
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.getByTestId('first-trigger').click();
	const parent = page.getByRole('dialog', { name: 'First', exact: true });
	// Keep an inherited entry animation observable even on a slow runner.
	await page.addStyleTag({
		content: '[popover] [popover] { animation-duration: 60s !important; }',
	});
	expect(
		await parent.evaluate((node) =>
			getComputedStyle(node).getPropertyValue('--ds-popover-motion-enter').trim(),
		),
	).toBeTruthy();
	await page.getByTestId('second-trigger').click();
	const child = page.getByRole('dialog', { name: 'Second', exact: true });
	await expect(child).toBeVisible();
	expect(await child.evaluate((node) => getComputedStyle(node).animationName)).toBe('none');
});

test('the JavaScript fallback opens the editor below the cell and matches its width', async ({
	page,
}) => {
	await openExample({ page, params: { forceFallback: true } });
	await expect
		.poll(async () => {
			const { anchor, popover } = await getGeometry({ page });
			return Math.max(
				Math.abs(anchor.x - popover.x),
				Math.abs(anchor.y + anchor.height - popover.y),
				Math.abs(anchor.width - popover.width),
			);
		})
		.toBeLessThanOrEqual(TOLERANCE);
});

test('an empty field can be reopened by name', async ({ page }) => {
	await openExample({ page });
	const textbox = page.getByRole('textbox', { name: 'Edit field' });
	await textbox.fill('   ');
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await page.getByRole('button', { name: 'Edit field', exact: true }).press('Enter');
	await expect(textbox).toHaveValue('   ');
});

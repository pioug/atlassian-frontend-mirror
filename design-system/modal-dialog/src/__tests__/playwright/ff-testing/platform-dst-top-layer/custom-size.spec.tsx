import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

type TGate = 'on' | 'off';

type TModalBox = {
	isTopLayer: boolean;
	width: number;
	height: number;
	x: number;
	y: number;
};

/**
 * Opens a modal of the fixture and returns the box of its visual surface: the legacy `section`,
 * or the element inside the top-layer `<dialog>` that has the size variables.
 */
async function measureModal({
	page,
	gate,
	caseId,
}: {
	page: Page;
	gate: TGate;
	caseId: string;
}): Promise<TModalBox> {
	await page.visitExample<typeof import('../../../../../examples/110-testing-custom-sizes.tsx')>(
		'design-system',
		'modal-dialog',
		'testing-custom-sizes',
		gate === 'on' ? { featureFlag, 'react-18-mode': 'modern' } : { 'react-18-mode': 'modern' },
	);
	await page.getByTestId(`${caseId}-trigger`).click();
	const modal = page.getByTestId('modal');
	await expect(modal).toBeVisible();

	return modal.evaluate(async (element) => {
		// Both paths animate the open. End the animations, so the box is the final one.
		for (const animation of document.getAnimations()) {
			animation.finish();
		}
		await new Promise((resolve) => requestAnimationFrame(resolve));

		const isTopLayer = element.tagName === 'DIALOG';
		const surface = isTopLayer
			? element.querySelector<HTMLElement>('[style*="--modal-dialog-width"]')
			: element;
		if (!surface) {
			throw new Error('Could not find the modal surface');
		}
		const style = getComputedStyle(surface);
		const rect = surface.getBoundingClientRect();
		const round = (value: number) => Math.round(value * 10) / 10;

		return {
			isTopLayer,
			width: round(parseFloat(style.width)),
			height: round(parseFloat(style.height)),
			x: round(rect.x),
			y: round(rect.y),
		};
	});
}

async function measureBothGates({
	page,
	caseId,
}: {
	page: Page;
	caseId: string;
}): Promise<{ legacy: TModalBox; topLayer: TModalBox }> {
	const legacy = await measureModal({ page, gate: 'off', caseId });
	const topLayer = await measureModal({ page, gate: 'on', caseId });
	expect(legacy.isTopLayer).toBe(false);
	expect(topLayer.isTopLayer).toBe(true);

	return { legacy, topLayer };
}

const sizeCases = [
	'body-height-100-percent',
	'body-width-and-height-100-percent',
	'body-height-420',
	'body-width-42-percent',
	'body-width-calc-percent',
	'body-width-calc-vw',
	'body-width-x-large',
	'viewport-width-42-percent',
	'viewport-width-calc-percent',
	'viewport-width-1200',
	'viewport-width-x-large',
	'viewport-height-420',
];

test.describe('ModalDialog top-layer custom size matches legacy, 1280x720', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
	});

	for (const caseId of sizeCases) {
		test(caseId, async ({ page }) => {
			const { legacy, topLayer } = await measureBothGates({ page, caseId });
			expect({ ...topLayer, isTopLayer: false }).toEqual(legacy);
		});
	}

	test('a percentage height in body scroll resolves against the legacy height cap', async ({
		page,
	}) => {
		const { topLayer } = await measureBothGates({ page, caseId: 'body-height-100-percent' });
		// 720px - 120px + 1px, as the legacy `Positioner`.
		expect(topLayer.height).toBe(601);
	});

	test('a calc() width with a percentage in viewport scroll resolves against the viewport', async ({
		page,
	}) => {
		const { topLayer } = await measureBothGates({ page, caseId: 'viewport-width-calc-percent' });
		// 100% - 80px of a 1280px viewport. The body scroll cap (100vw - 120px) does not apply.
		expect(topLayer.width).toBe(1200);
	});
});

test.describe('ModalDialog top-layer custom size matches legacy, 1000x600', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1000, height: 600 });
	});

	for (const caseId of [
		'body-height-100-percent',
		'body-width-x-large',
		'viewport-width-1200',
		'viewport-width-x-large',
	]) {
		test(caseId, async ({ page }) => {
			const { legacy, topLayer } = await measureBothGates({ page, caseId });
			expect({ ...topLayer, isTopLayer: false }).toEqual(legacy);
		});
	}
});

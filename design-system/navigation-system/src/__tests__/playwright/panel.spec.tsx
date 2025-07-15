import invariant from 'tiny-invariant';

import { expect, type Locator, type Page, test } from '@af/integration-testing';

const viewport = {
	small: { width: 768, height: 768 },
	medium: { width: 1024, height: 768 },
	large: { width: 1440, height: 768 },
};

async function getBrowserTypeName(page: Page) {
	const browser = page.context().browser();
	invariant(browser);
	return browser.browserType().name();
}

/**
 * Waits for a single frame.
 *
 * This is helpful for avoiding flake by ensuring that drag events have been processed,
 * because `pragmatic-drag-and-drop` will schedule updates into frames.
 */
async function waitForFrame(page: Page) {
	await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
}

async function getLocatorWidth(locator: Locator): Promise<number> {
	const boundingBox = await locator.boundingBox();
	invariant(boundingBox !== null);
	return boundingBox.width;
}

async function dragAndDrop({
	page,
	locator,
	target,
}: {
	page: Page;
	locator: Locator;
	target: { x: number; y: number };
}) {
	await locator.hover();
	await page.mouse.down();
	await page.mouse.move(target.x, target.y);
	await page.mouse.move(target.x, target.y);
	await waitForFrame(page);
	await page.mouse.up();
}

const steppedDrag = {
	async start({ page, locator }: { page: Page; locator: Locator }) {
		await locator.hover();
		await page.mouse.down();
	},
	async moveTo({ page, target }: { page: Page; target: { x: number; y: number } }) {
		await page.mouse.move(target.x, target.y);
		await page.mouse.move(target.x, target.y);

		await waitForFrame(page);
	},
	async drop({ page }: { page: Page }) {
		await page.mouse.up();
	},
};

const defaultSideNavWidth = 320;

test.describe('resizing', () => {
	test.beforeEach(async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await page.visitExample('design-system', 'navigation-system', 'resizable-slots');
	});

	test('should maintain proportional width as the side nav grows', async ({ page }) => {
		const panel = page.getByTestId('panel');
		const panelSplitter = page.getByTestId('panel-slot-panel-splitter');
		const sideNav = page.getByTestId('side-nav');

		await page.setViewportSize(viewport.large);

		await expect(sideNav).toHaveWidth(defaultSideNavWidth);

		const expectedPanelMaxWidth = (viewport.large.width - defaultSideNavWidth) / 2;

		// Resize the panel to its maximum size
		await dragAndDrop({ page, locator: panelSplitter, target: { x: 0, y: 0 } });

		await expect(panel).toHaveWidth(expectedPanelMaxWidth);

		const sideNavSplitter = page.getByTestId('side-nav-slot-panel-splitter');

		const isWebkit = (await getBrowserTypeName(page)) === 'webkit';

		// Resize the side nav to max width
		await steppedDrag.start({ page, locator: sideNavSplitter });

		await steppedDrag.moveTo({
			page,
			target: { x: viewport.large.width / 4, y: 0 },
		});

		{
			const expectedPanelWidth = (viewport.large.width - viewport.large.width / 4) / 2;
			await expect(panel).toHaveWidth(
				/**
				 * In Webkit the panel is 1px smaller than expected.
				 */
				isWebkit ? expectedPanelWidth - 1 : expectedPanelWidth,
			);
		}

		await steppedDrag.moveTo({
			page,
			target: { x: viewport.large.width / 3, y: 0 },
		});

		{
			const expectedPanelWidth = (viewport.large.width - viewport.large.width / 3) / 2;
			await expect(panel).toHaveWidth(
				/**
				 * In Webkit the panel is 1px smaller than expected.
				 */
				isWebkit ? expectedPanelWidth - 1 : expectedPanelWidth,
			);
		}

		await steppedDrag.moveTo({
			page,
			target: { x: viewport.large.width / 2, y: 0 },
		});

		await expect(panel).toHaveWidth((viewport.large.width - viewport.large.width / 2) / 2);

		await steppedDrag.drop({ page });

		await expect(panel).toHaveWidth((viewport.large.width - viewport.large.width / 2) / 2);
	});

	test('should maintain proportional width as the window shrinks', async ({ page }) => {
		const panel = page.getByTestId('panel');
		const panelSplitter = page.getByTestId('panel-slot-panel-splitter');

		await page.setViewportSize(viewport.large);

		// Resize the panel to max width
		await dragAndDrop({ page, locator: panelSplitter, target: { x: 0, y: 0 } });

		await expect(panel).toHaveWidth((viewport.large.width - defaultSideNavWidth) / 2);

		await page.setViewportSize(viewport.medium);
		await expect(panel).toHaveWidth((viewport.medium.width - defaultSideNavWidth) / 2);
	});

	test.describe('mouse resizing', () => {
		test('should use initial width as the resizing minimum', async ({ page }) => {
			const panel = page.getByTestId('panel');
			const panelSplitter = page.getByTestId('panel-slot-panel-splitter');

			await page.setViewportSize(viewport.large);

			const panelInitialWidth = await getLocatorWidth(panel);

			// Resize the panel to min width
			await dragAndDrop({
				page,
				locator: panelSplitter,
				target: { x: viewport.large.width, y: 0 },
			});

			await expect(panel).toHaveWidth(panelInitialWidth);
		});

		test('should use half the content area as the resizing maximum', async ({ page }) => {
			const panel = page.getByTestId('panel');
			const panelSplitter = page.getByTestId('panel-slot-panel-splitter');
			const sideNav = page.getByTestId('side-nav');

			await page.setViewportSize(viewport.large);

			await expect(sideNav).toHaveWidth(defaultSideNavWidth);
			const expectedPanelMaxWidth = (viewport.large.width - defaultSideNavWidth) / 2;

			await dragAndDrop({ page, locator: panelSplitter, target: { x: 0, y: 0 } });

			await expect(panel).toHaveWidth(expectedPanelMaxWidth);
		});
	});

	test.describe('keyboard resizing', () => {
		test('should use initial width as the resizing minimum', async ({ page }) => {
			await page.setViewportSize(viewport.large);

			const panelInitialWidth = await getLocatorWidth(page.getByTestId('panel'));

			const inputRange = page.getByRole('slider', { name: 'Resize panel' });
			// Focus on the input range to ensure the minimum value is calculated and updated
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('min', panelInitialWidth.toString());
		});

		test('should use half the content area as the resizing maximum', async ({ page }) => {
			await page.setViewportSize(viewport.large);

			const sideNavWidth = await getLocatorWidth(page.getByTestId('side-nav'));
			const expectedPanelMaxWidth = (viewport.large.width - sideNavWidth) / 2;

			const inputRange = page.getByRole('slider', { name: 'Resize panel' });
			// Focus on the input range to ensure the minimum value is calculated and updated
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('max', expectedPanelMaxWidth.toString());
		});

		test('should update the resize bounds and value text when the viewport is resized and the slider element is focused', async ({
			page,
		}) => {
			await page.setViewportSize(viewport.large);

			const viewportLargeExpectedBounds = {
				max: (viewport.large.width - defaultSideNavWidth) / 2, // Comes from max-width constraint in panel.tsx
				min: 350, // From the `defaultWidth` in resizable-slots.tsx
			};

			const inputRange = page.getByRole('slider', { name: 'Resize panel' });
			// Focus on the input range to ensure the max value is recalculated when the viewport is resized
			await inputRange.focus();
			await expect(inputRange).toHaveAttribute('max', viewportLargeExpectedBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', viewportLargeExpectedBounds.min.toString());

			// Resize the viewport to a smaller size
			await page.setViewportSize(viewport.medium);
			const viewportMediumExpectedBounds = {
				max: (viewport.medium.width - defaultSideNavWidth) / 2, // Comes from max-width constraint in panel.tsx
				min: 350, // From the `defaultWidth` in resizable-slots.tsx
			};

			await expect(inputRange).toHaveAttribute('max', viewportMediumExpectedBounds.max.toString());
			await expect(inputRange).toHaveAttribute('min', viewportMediumExpectedBounds.min.toString());
		});
	});
});

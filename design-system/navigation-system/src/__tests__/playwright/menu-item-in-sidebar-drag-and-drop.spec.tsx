import invariant from 'tiny-invariant';

import { expect, type Locator, type Page, test } from '@af/integration-testing';

/**
 * Drag to a `box` in a way that works for all browsers.
 * Assumes a drag has already started.
 */
async function reorderAfter({
	page,
	draggable,
	dropTarget,
}: {
	page: Page;
	draggable: Locator;
	dropTarget: Locator;
}) {
	const draggableBox = await draggable.boundingBox();
	invariant(draggableBox, 'unable to get bounding box for draggable');

	const dropTargetBox = await dropTarget.boundingBox();
	invariant(dropTargetBox, 'unable to get bounding box for dropTarget');

	// Start a drag
	await page.mouse.move(draggableBox.x + 1, draggableBox.y + 1);
	await page.mouse.down();
	await page.mouse.move(draggableBox.y + 10, draggableBox.y + 1);

	// Move over drop target
	await page.mouse.move(dropTargetBox.x, dropTargetBox.y + dropTargetBox.height - 2);

	// Second movement needed for Firefox
	await page.mouse.move(dropTargetBox.x, dropTargetBox.y + dropTargetBox.height - 1);

	// Finish the drop
	await page.mouse.up();
}

test.describe('menu item drag and drop in the sidebar', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'drag-and-drop-jira');
	});

	// This test helps give us confidence that our end to end story is working correctly
	test('smoke test (project reordering)', async ({ page }) => {
		const group = page.locator('[data-testid="project-group-starred"]');

		// Pulled this into a function as `allInnerTexts()` sometimes returned rouge
		// newline characters on the end of strings while on CI.
		async function getInnerTexts() {
			return (await group.locator('a').allInnerTexts()).map((text) => text.trim());
		}

		expect(await getInnerTexts()).toEqual([
			'Modernize typography',
			'F1 sponsorship',
			'Mobile application',
		]);

		const [first, _, last] = await group.locator('a').all();

		await reorderAfter({ page, draggable: first, dropTarget: last });

		expect(await getInnerTexts()).toEqual([
			'F1 sponsorship',
			'Mobile application',
			'Modernize typography', // Moved after "Mobile application"
		]);
	});
});

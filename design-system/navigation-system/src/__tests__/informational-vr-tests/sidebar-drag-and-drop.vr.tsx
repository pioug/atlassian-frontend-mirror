import type { Locator, Page } from '@playwright/test';
import invariant from 'tiny-invariant';

import type { Hooks, SnapshotTestOptions } from '@af/visual-regression';
import { Device, snapshotInformational } from '@atlassian/gemini';

import { App } from '../../../examples/drag-and-drop/jira/entry';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'desktop-chrome',
		device: Device.DESKTOP_CHROME,
	},
	{
		environment: { colorScheme: 'light' },
		name: 'desktop-webkit',
		device: Device.DESKTOP_WEBKIT,
	},
	{
		environment: { colorScheme: 'light' },
		name: 'desktop-firefox',
		device: Device.DESKTOP_FIREFOX,
	},
];

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

	// Not dropping for VR snapshot
}

snapshotInformational(App, {
	description: 'Sidebar drag and drop',
	variants: variants,
	prepare: async (page) => {
		const group = page.locator('[data-testid="project-group-starred"]');

		const linkMenuItems = group.locator('a');

		/**
		 * Previously used `.all()` which was causing flake, because it was sometimes empty.
		 *
		 * According to the docs: "locator.all() does not wait for elements to match the locator,
		 * and instead immediately returns whatever is present in the page."
		 *
		 * Whereas `.first()` and `.last()` should preserve the auto-waiting that locators usually have.
		 */
		const first = linkMenuItems.first();
		const last = linkMenuItems.last();

		await reorderAfter({ page, draggable: first, dropTarget: last });
	},
});

/**
 * This could have been done with standard VR testing "states".
 *
 * Why it's here:
 * - It's colocated with the other relevant test
 * - I think we might need more than just `.hover()` to trigger it
 *
 * Note: the Safari bug being tested, does not currently appear in the
 * WebKit browser that our version of Playwright is using.
 *
 * - Bug is present in Webkit 18.4 (used by playwright@1.52.0)
 * - Bug is not present in Webkit 17.4 (used by playwright@1.44.1)
 */
snapshotInformational(App, {
	description: 'Sidebar drag and drop - hover bug',
	variants: variants,
	prepare: async (page) => {
		const item = page.locator('[data-testid="recent-menu-item"]');

		await item.hover();
	},
});

import invariant from 'tiny-invariant';

import { snapshotInformational } from '@af/visual-regression';

import Stateful from '../../../../examples/0-stateful';
import Basic from '../../../../examples/99-testing';

snapshotInformational(Basic, {
	description: 'after sorting',
	variants: [
		{
			name: 'Light',
			environment: { colorScheme: 'light' },
		},
	],
	prepare: async (page) => {
		// Go to page 3
		await page.getByRole('button', { name: 'Page 3' }).click();
		// Sort by party
		await page.getByRole('button', { name: 'Party' }).click();

		// Wait until the table has updated
		// Otherwise it seems like the test can be flakey
		await page.locator('[aria-sort="ascending"]', { hasText: 'Party' }).waitFor();
	},
});

snapshotInformational(Stateful, {
	description: 'during a drag',
	variants: [
		{
			name: 'Light',
			environment: { colorScheme: 'light' },
		},
	],
	prepare: async (page) => {
		const firstRow = page.getByTestId(
			'table--george-washington-1789-1797--rankable--table--row--rankable--table--body--row',
		);
		const thirdRow = page.getByTestId(
			'table--thomas-jefferson-1801-1809--rankable--table--row--rankable--table--body--row',
		);
		const dropTarget = await thirdRow.boundingBox();
		invariant(dropTarget);

		await expect(firstRow).toHaveAttribute('draggable');

		await firstRow.hover({ position: { x: 0, y: 0 } });
		await page.mouse.down();

		/**
		 * `dropTarget.x` and `dropTarget.y` correspond to the top left point so adding some arbitrary offsets.
		 *
		 * Calling twice because otherwise the drag preview is in the old position when the snapshot is taken.
		 */
		await page.mouse.move(dropTarget.x + 100, dropTarget.y + 10);
		await page.mouse.move(dropTarget.x + 100, dropTarget.y + 10);
	},
});

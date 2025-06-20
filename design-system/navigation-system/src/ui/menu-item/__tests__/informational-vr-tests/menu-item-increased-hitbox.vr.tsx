import invariant from 'tiny-invariant';

import { Device, snapshotInformational } from '@atlassian/gemini';

import { ExpandableMenuItemNestedNoSelection } from '../../../../../examples/expandable-menu-item';
import { expandableMenuItemIndentation } from '../../constants';

// Need to make sure our increased hitbox logic works in all browsers
const variants = [
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

const indentPerLevel = Number(expandableMenuItemIndentation.replace('px', ''));
invariant(Number.isInteger(indentPerLevel), 'Unable to cast indent from a pixel value to a number');

/**
 * `@atlassian/gemini` does not re-export the `Page` type from `@playwright/test`.
 * This package has not dependency on `@playwright/test`.
 * So we we pulling out the `Page` type from the `snapshotInformational` function
 */
type TPrepareFn = Exclude<Parameters<typeof snapshotInformational>['1']['prepare'], undefined>;
type TPage = Parameters<TPrepareFn>['0'];

async function getBoxForItem4({ page }: { page: TPage }) {
	const button = page.getByRole('link', { name: 'Item 4' });

	const box = await button.boundingBox();
	invariant(box, 'Unable to get box');

	return box;
}

snapshotInformational(ExpandableMenuItemNestedNoSelection, {
	description: 'Increasing hitbox for nested items (:hover)',
	variants,
	async prepare(page) {
		const box = await getBoxForItem4({ page });

		// Item 4 is on level 3
		await page.mouse.move(box.x - indentPerLevel * 3, box.y + box.height / 2);
	},
});

snapshotInformational(ExpandableMenuItemNestedNoSelection, {
	description: 'Increasing hitbox for nested items (click target)',
	variants,
	async prepare(page) {
		const box = await getBoxForItem4({ page });

		// Item 4 is on level 3
		await page.mouse.click(box.x - indentPerLevel * 3, box.y + box.height / 2);
	},
});

snapshotInformational(ExpandableMenuItemNestedNoSelection, {
	description: 'Increasing hitbox for nested items (too far back)',
	variants,
	async prepare(page) {
		const box = await getBoxForItem4({ page });

		// Item 4 is on level 3
		// moving back further than the increased hitbox size for level 3
		await page.mouse.move(box.x - 1 - indentPerLevel * 3, box.y + box.height / 2);
	},
});

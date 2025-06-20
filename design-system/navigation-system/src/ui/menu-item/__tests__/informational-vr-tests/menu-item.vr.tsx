import { Device, snapshotInformational } from '@atlassian/gemini';

import {
	ButtonMenuItemBasic,
	ButtonMenuItemDisabled,
} from '../../../../../examples/button-menu-item';
import {
	ExpandableMenuItemSelectable,
	ExpandableMenuItemSelected,
	ExpandableMenuItemUnselectable,
} from '../../../../../examples/expandable-menu-item';
import {
	FlyoutMenuItemTriggerBasic,
	FlyoutMenuItemTriggerSelected,
} from '../../../../../examples/flyout-menu-item';
import { LinkMenuItemBasic, LinkMenuItemSelected } from '../../../../../examples/link-menu-item';
import MenuItemScrollIntoView from '../../../../../examples/menu-item-scroll-into-view';

/**
 * This test used to be a standard VR but it flaked and led to https://hello.jira.atlassian.cloud/browse/ENGHEALTH-26534
 *
 * It seems like it only flaked on the a11y pipeline and it's not exactly clear why.
 *
 * Making it an informational VR and explicitly waiting for scrolling to finish,
 * which should hopefully prevent any more inconsistent states.
 */
snapshotInformational(MenuItemScrollIntoView, {
	description: 'Link menu item - scroll into view behavior',
	variants: [
		/**
		 * We are testing against multiple browsers, as we are progressively enhancing the scroll behavior with
		 * [scrollIntoViewIfNeeded](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded),
		 * which is not supported in all browsers.
		 */
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
		},
		{
			name: 'desktop firefox',
			device: Device.DESKTOP_FIREFOX,
			environment: { colorScheme: 'light' },
		},
		{
			name: 'desktop safari',
			device: Device.DESKTOP_WEBKIT,
			environment: { colorScheme: 'light' },
		},
	],
	async prepare(page) {
		const filtersMenuItem = await page.getByRole('link', { name: 'Filters' }).elementHandle();

		// Navigate to filters, which will initiate a scroll into view
		await page.getByRole('button', { name: 'Filters' }).click();

		// Wait for the filters menu item to have a stable bounding box
		// Which implies the scroll has finished
		await filtersMenuItem?.waitForElementState('stable');
	},
});

snapshotInformational(ButtonMenuItemBasic, {
	description: 'Button menu item - pressed',
	async prepare(page) {
		await page.getByRole('button', { name: 'Basic button menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(ButtonMenuItemDisabled, {
	description: 'Button menu item - disabled - pressed',
	async prepare(page) {
		await page.getByRole('button', { name: 'Disabled' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(LinkMenuItemBasic, {
	description: 'Link menu item - pressed',
	async prepare(page) {
		await page.getByRole('link', { name: 'Basic link menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(LinkMenuItemSelected, {
	description: 'Link menu item - selected - pressed',
	async prepare(page) {
		await page.getByRole('link', { name: 'Selected link menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(FlyoutMenuItemTriggerBasic, {
	description: 'Flyout menu item - pressed',
	async prepare(page) {
		await page.getByRole('button', { name: 'Flyout menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(FlyoutMenuItemTriggerSelected, {
	description: 'Flyout menu item - selected - pressed',
	async prepare(page) {
		await page.getByRole('button', { name: 'Flyout menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(ExpandableMenuItemUnselectable, {
	description: 'Expandable menu item - not selectable - pressed',
	async prepare(page) {
		await page.getByRole('button', { name: 'Parent menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(ExpandableMenuItemSelectable, {
	description: 'Expandable menu item - selectable - pressed',
	async prepare(page) {
		await page.getByRole('link', { name: 'Parent menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

snapshotInformational(ExpandableMenuItemSelected, {
	description: 'Expandable menu item - selected - pressed',
	async prepare(page) {
		await page.getByRole('link', { name: 'Parent menu item' }).hover();

		// Press the mouse but don't release it
		await page.mouse.down();
	},
});

import { snapshotInformational } from '@af/visual-regression';

import { WithLayeredComponentsExample } from '../../../examples/90-with-layered-components';

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open popup',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByTestId('popup-trigger').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open popup select',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByRole('button', { name: "I'm a pop up select, click me!" }).click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open tooltip',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByRole('button', { name: 'Hover on me to view tooltip!' }).hover();

		await page.getByRole('tooltip').waitFor();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description:
		'modal with select (z-index: 9999, menuPortalTarget: document.body, menuPosition: fixed)',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByTestId('select-zindex-fixed-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with select (menuPosition: fixed)',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByTestId('select-fixed-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with select (menuPosition: absolute)',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByTestId('select-absolute-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with flag',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to middle' }).click();

		await page.getByRole('button', { name: 'Add flag' }).click();

		await page.getByRole('alert').waitFor();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with dropdown menu',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();

		await page.getByRole('button', { name: 'Scroll to bottom' }).click();

		// Wait for the scroll container to stabilise to prevent against flake.
		// ModalDialog's scroll container has a scroll event listener that determines if the container
		// is overflowing, to conditionally show a bottom border.
		const scrollContainer = await page.getByTestId('modal--scrollable').elementHandle();
		await scrollContainer?.waitForElementState('stable');

		await page.getByRole('button', { name: "I'm a dropdown menu, click me!" }).click();
	},
});

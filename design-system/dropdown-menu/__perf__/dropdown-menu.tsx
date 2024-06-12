import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import type { InteractionTaskArgs, PublicInteractionTask } from 'storybook-addon-performance';
import invariant from 'tiny-invariant';

import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemCheckboxGroup,
	DropdownItemGroup,
	DropdownItemRadio,
	DropdownItemRadioGroup,
} from '../src';

const DropdownMenuPerformance = () => (
	<DropdownMenu trigger="Page actions" testId="dropdown-menu">
		<DropdownItemGroup>
			<DropdownItem>Edit</DropdownItem>
			<DropdownItem>Copy</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
		<DropdownItemCheckboxGroup id="flags" title="Flags">
			<DropdownItemCheckbox id="tokens">Tokens</DropdownItemCheckbox>
			<DropdownItemCheckbox id="dark-mode">Dark mode</DropdownItemCheckbox>
		</DropdownItemCheckboxGroup>
		<DropdownItemRadioGroup id="font-size" title="Font size">
			<DropdownItemRadio id="smaller">Smaller</DropdownItemRadio>
			<DropdownItemRadio id="default" defaultSelected>
				Default
			</DropdownItemRadio>
			<DropdownItemRadio id="larger">Larger</DropdownItemRadio>
		</DropdownItemRadioGroup>
	</DropdownMenu>
);

const getTrigger = (container: HTMLElement): HTMLElement => {
	const trigger: HTMLElement | null = container.querySelector(
		'[data-testid="dropdown-menu--trigger"]',
	);
	if (trigger === null) {
		throw new Error('Could not find the dropdown menu trigger');
	}
	return trigger;
};

const interactionTasks: PublicInteractionTask[] = [
	{
		name: 'Display dropdown',
		description: 'Click to open the dropdown menu',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);

			await controls.time(async () => {
				fireEvent.click(trigger);
				await screen.findByText('Edit');
			});
		},
	},
	{
		name: 'Hide dropdown (trigger)',
		description: 'Click the trigger to hide the dropdown menu',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			await screen.findByText('Edit');
			await controls.time(async () => {
				fireEvent.click(trigger);
				await waitFor(() => invariant(screen.queryByText('Edit') === null));
			});
		},
	},
	{
		name: 'Hide dropdown (escape)',
		description: 'Press escape to hide the dropdown menu',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			await screen.findByText('Edit');
			await controls.time(async () => {
				fireEvent.keyDown(container, { key: 'Escape', code: 'Escape' });
				await waitFor(() => invariant(screen.queryByText('Edit') === null));
			});
		},
	},
	{
		name: 'Hide dropdown (outside click)',
		description: 'Click outside to hide the dropdown menu',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			await screen.findByText('Edit');
			await controls.time(async () => {
				fireEvent.click(container);
				await waitFor(() => invariant(screen.queryByText('Edit') === null));
			});
		},
	},
	{
		name: 'Select item',
		description: 'Click menu item to select it',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			const label = await screen.findByText('Edit');
			await controls.time(async () => {
				label.click();
			});
		},
	},
	{
		/**
		 * NOTE:
		 * This test has an unhandled error on CI, but runs fine locally.
		 * It doesn't stop the pipeline, but its results aren't reported.
		 */
		name: 'Select checkbox',
		description: 'Click a checkbox menu item to select it',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			const label = await screen.findByText('Tokens');
			const checkbox: HTMLElement | null = label.closest('[role="checkbox"]');
			if (checkbox === null) {
				throw new Error('Could not find the checkbox');
			}

			await controls.time(async () => {
				checkbox.click();
				await waitFor(
					() => {
						const ariaChecked = checkbox.getAttribute('aria-checked');
						invariant(ariaChecked === 'true', `Checkbox should be checked (is "${ariaChecked}")`);
					},
					{ timeout: 5000 },
				);
			});
		},
	},
	{
		/**
		 * NOTE:
		 * This test has an unhandled error on CI, but runs fine locally.
		 * It doesn't stop the pipeline, but its results aren't reported.
		 */
		name: 'Select radio',
		description: 'Click a radio menu item to select it',
		run: async ({ container, controls }: InteractionTaskArgs): Promise<void> => {
			const trigger = getTrigger(container);
			fireEvent.click(trigger);

			const label = await screen.findByText('Smaller');
			const radio: HTMLElement | null = label.closest('[role="radio"]');
			if (radio === null) {
				throw new Error('Could not find the radio');
			}

			await controls.time(async () => {
				radio.click();
				await waitFor(
					() => {
						const ariaChecked = radio.getAttribute('aria-checked');
						invariant(ariaChecked === 'true', `Radio should be checked (is "${ariaChecked}")`);
					},
					{ timeout: 5000 },
				);
			});
		},
	},
];

DropdownMenuPerformance.story = {
	name: 'Dropdown menu',
	parameters: {
		performance: {
			interactions: interactionTasks,
		},
	},
};

export default DropdownMenuPerformance;

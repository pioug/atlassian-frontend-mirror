import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { type IconProps } from '@atlaskit/icon/types';

import { IconButton } from '../../../new';

async function assertDropdownIsVisible(icon: HTMLElement) {
	fireEvent.click(icon);
	const dropdownMenu = screen.getByTestId('dropdown--content');
	expect(dropdownMenu).toBeVisible();
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe(`Buttons should not throw away events due to re-renders when using various icon API methods`, () => {
	it('renderProp', async () => {
		render(
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...props }) => (
					<IconButton
						{...props}
						icon={(iconProps) => (
							<ShowMoreHorizontalIcon {...iconProps} testId="icon" color="currentColor" />
						)}
						label="more"
						ref={triggerRef}
						testId="button"
					/>
				)}
				shouldRenderToParent
				testId="dropdown"
			>
				<DropdownItemGroup>
					<DropdownItem>Edit</DropdownItem>
					<DropdownItem>Share</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const icon = screen.getByTestId('icon');
		await assertDropdownIsVisible(icon);
	});

	it(`bounded`, async () => {
		render(
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...props }) => (
					<IconButton
						{...props}
						icon={ShowMoreHorizontalIcon}
						label="more"
						ref={triggerRef}
						testId="button"
					/>
				)}
				shouldRenderToParent
				testId="dropdown"
			>
				<DropdownItemGroup>
					<DropdownItem>Edit</DropdownItem>
					<DropdownItem>Share</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		// eslint-disable-next-line testing-library/no-node-access
		const icon = screen.getByTestId('button').querySelector('svg')?.parentNode as HTMLSpanElement;
		await assertDropdownIsVisible(icon);
	});

	it(`forwardRef`, async () => {
		const ForwardRefIcon: React.ForwardRefExoticComponent<
			React.PropsWithoutRef<IconProps> & React.RefAttributes<HTMLSpanElement>
		> = React.forwardRef<HTMLSpanElement, IconProps>((props, ref) => (
			<ShowMoreHorizontalIcon
				{...props}
				// @ts-ignore
				ref={ref}
				testId="icon"
				color="currentColor"
			/>
		));

		render(
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...props }) => (
					<IconButton
						{...props}
						icon={ForwardRefIcon}
						label="more"
						ref={triggerRef}
						testId="button"
					/>
				)}
				shouldRenderToParent
				testId="dropdown"
			>
				<DropdownItemGroup>
					<DropdownItem>Edit</DropdownItem>
					<DropdownItem>Share</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);

		const icon = screen.getByTestId('icon');
		await assertDropdownIsVisible(icon);
	});
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { type IconProps } from '@atlaskit/icon/types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { IconButton } from '../../../new';

async function assertDropdownIsVisible(icon: HTMLElement) {
	await userEvent.click(icon);
	const dropdownMenu = screen.getByTestId('dropdown--content');
	expect(dropdownMenu).toBeVisible();
}

async function assertDropdownIsNotVisible(icon: HTMLElement) {
	await userEvent.click(icon);
	const dropdownMenu = screen.queryByTestId('dropdown--content');
	expect(dropdownMenu).not.toBeInTheDocument();
}

describe(`Buttons should not throw away events due to re-renders when using various icon API methods`, () => {
	describe('renderProp', () => {
		ffTest(
			'platform.design-system-team.button-render-prop-fix_lyo55',
			// Test when true
			async () => {
				render(
					<DropdownMenu<HTMLButtonElement>
						trigger={({ triggerRef, ...props }) => (
							<IconButton
								{...props}
								icon={(iconProps) => <MoreIcon {...iconProps} testId="icon" />}
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
			},
			// Test when false
			async () => {
				render(
					<DropdownMenu<HTMLButtonElement>
						trigger={({ triggerRef, ...props }) => (
							<IconButton
								{...props}
								icon={(iconProps) => <MoreIcon {...iconProps} testId="icon" />}
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

				// There's an issue when running tests using React 18 where the dropdown is actually visible in the testing environment,
				// however when testing in real life the same bug persists as with React 16 where the dropdown is not visible and takes
				// two clicks to show.
				if (process.env.IS_REACT_18) {
					await assertDropdownIsVisible(icon);
				} else {
					await assertDropdownIsNotVisible(icon);
				}
			},
		);
	});

	it(`bounded`, async () => {
		render(
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...props }) => (
					<IconButton {...props} icon={MoreIcon} label="more" ref={triggerRef} testId="button" />
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
		const ForwardRefIcon = React.forwardRef<HTMLSpanElement, IconProps>((props, ref) => (
			<MoreIcon
				{...props}
				// @ts-ignore
				ref={ref}
				testId="icon"
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

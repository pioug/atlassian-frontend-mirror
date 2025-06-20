import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomeIcon from '@atlaskit/icon/core/home';

import { ButtonMenuItem } from '../../button-menu-item';
import { FlyoutMenuItem } from '../../flyout-menu-item/flyout-menu-item';
import { FlyoutMenuItemContent } from '../../flyout-menu-item/flyout-menu-item-content';
import { FlyoutMenuItemTrigger } from '../../flyout-menu-item/flyout-menu-item-trigger';
import { LinkMenuItem } from '../../link-menu-item';

const NavWrapper = ({
	children,
	label = 'main',
}: {
	children: React.ReactNode;
	label?: string;
}) => (
	<nav aria-label={label}>
		<ul>{children}</ul>
	</nav>
);

describe('FlyoutMenuItem', () => {
	describe('accessibility', () => {
		it('should pass a11y checks when popup is closed', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});

		it('should pass a11y checks when popup is open', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<FlyoutMenuItem isDefaultOpen>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<NavWrapper label="secondary">
								<ButtonMenuItem>Item 1</ButtonMenuItem>
							</NavWrapper>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});
	});

	it('should only render the trigger by default', () => {
		render(
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	it('should render the trigger and popup content when defaultOpen is true', () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
		expect(screen.getByText('Item 1')).toBeVisible();
	});

	it('should render the popup when the trigger is clicked', async () => {
		render(
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(screen.getByText('Item 1')).toBeVisible();
	});

	it('should close the popup when the trigger is clicked and the popup is open', async () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.queryByText('Item 1')).toBeVisible();

		await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	it('should close the popup when the popup is open and a click occurs outside of the popup', async () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.queryByText('Item 1')).toBeVisible();

		await userEvent.click(document.body);

		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	it('should close the popup when the escape key is pressed', async () => {
		render(
			<FlyoutMenuItem isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.queryByText('Item 1')).toBeVisible();

		await userEvent.keyboard('{Escape}');

		expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
	});

	describe('onOpenChange', () => {
		it('should not call onOpenChange on initial render', () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(onOpenChange).not.toHaveBeenCalled();
		});

		it('should call onOpenChange when the trigger is clicked and the popup is open', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should call onOpenChange when the popup is open and the escape key is pressed', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.keyboard('{Escape}');

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it('should call onOpenChange when the popup is open and a click occurs outside of the popup', async () => {
			const onOpenChange = jest.fn();

			render(
				<FlyoutMenuItem onOpenChange={onOpenChange} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(document.body);

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	it('should set the correct attributes when an id is provided', () => {
		render(
			<FlyoutMenuItem id="my-id" isDefaultOpen>
				<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent containerTestId="container">
					<ButtonMenuItem>Item 1</ButtonMenuItem>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>,
		);

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
			'aria-controls',
			'my-id',
		);
		expect(screen.getByTestId('container')).toHaveAttribute('id', 'my-id');
	});

	describe('trigger', () => {
		it('should be accessible', async () => {
			render(
				<NavWrapper>
					<FlyoutMenuItem>
						<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
						<FlyoutMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
						</FlyoutMenuItemContent>
					</FlyoutMenuItem>
				</NavWrapper>,
			);

			await expect(screen.getByRole('button', { name: 'Trigger' })).toBeAccessible();
		});

		it('should render the elemBefore when provided', () => {
			render(
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger
						elemBefore={
							<HomeIcon
								label=""
								testId="navigation-system.ui.menu-item.test-icon"
								color="currentColor"
							/>
						}
					>
						Trigger
					</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.getByTestId('navigation-system.ui.menu-item.test-icon')).toBeVisible();
		});

		it('should call onClick when the trigger is clicked', async () => {
			const onClick = jest.fn();

			render(
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger onClick={onClick}>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

			expect(onClick).toHaveBeenCalled();
		});

		it('should have the correct aria attributes', async () => {
			render(
				<FlyoutMenuItem>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-haspopup',
				'true',
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-expanded',
				'false',
			);
		});

		it('should have the correct aria attributes when the popup is open', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
				'aria-expanded',
				'true',
			);
		});
	});

	describe('popup content', () => {
		it('should close the popup when a menu item button inside the popup is clicked', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByRole('button', { name: 'Item 1' }));

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});

		it('should close the popup when a menu item link inside the popup is clicked', async () => {
			render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<LinkMenuItem href="#">Item 1</LinkMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);

			expect(screen.queryByText('Item 1')).toBeVisible();

			await userEvent.click(screen.getByRole('link', { name: 'Item 1' }));

			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});

	describe('isOpen', () => {
		it('should render the content when isOpen is true', () => {
			render(
				<FlyoutMenuItem isOpen={true}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Item 1')).toBeVisible();
		});

		it('should not render the content when isOpen is false', () => {
			render(
				<FlyoutMenuItem isOpen={false} isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});

		it('should remove the content from the document when isOpen is updated to false after the initial render', () => {
			const { rerender } = render(
				<FlyoutMenuItem isDefaultOpen>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			// Initially, the content should be visible
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Item 1')).toBeVisible();
			// Update the isOpen prop to false
			rerender(
				<FlyoutMenuItem isDefaultOpen isOpen={false}>
					<FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
					<FlyoutMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
					</FlyoutMenuItemContent>
				</FlyoutMenuItem>,
			);
			// Now, the content should disappear from the document
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
		});
	});
});

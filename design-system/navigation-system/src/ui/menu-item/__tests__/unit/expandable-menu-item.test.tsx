import React, { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ButtonMenuItem } from '../../button-menu-item';
import { ExpandableMenuItem } from '../../expandable-menu-item/expandable-menu-item';
import { ExpandableMenuItemContent } from '../../expandable-menu-item/expandable-menu-item-content';
import { ExpandableMenuItemTrigger } from '../../expandable-menu-item/expandable-menu-item-trigger';
import { MenuList } from '../../menu-list';

jest.mock('@atlaskit/icon/core/chevron-right', () => ({
	__esModule: true,
	default: function ChevronDownIcon() {
		return <span data-testid="collapsed-icon" />;
	},
}));

jest.mock('@atlaskit/icon/core/chevron-down', () => ({
	__esModule: true,
	default: function ChevronDownIcon() {
		return <span data-testid="expanded-icon" />;
	},
}));

// Wrapper to reflect actual usage within a navigation menu
const NavWrapper = ({ children }: { children: React.ReactNode }) => (
	<nav>
		<MenuList>{children}</MenuList>
	</nav>
);

describe('ExpandableMenuItem', () => {
	describe('accessibility', () => {
		it('should pass a11y checks when expanded', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Test expandable content</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});

		it('should pass a11y checks when collapsed', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
							<ButtonMenuItem>Item 2</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});
	});

	it('should not render the expandable content by default', () => {
		render(
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<ButtonMenuItem>Test expandable content</ButtonMenuItem>
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>,
		);

		expect(screen.queryByText('Test expandable content')).not.toBeInTheDocument();
	});

	it('should render the expandable content after expandable menu is expanded and then collapsed again ', async () => {
		render(
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<ButtonMenuItem>Test expandable content</ButtonMenuItem>
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>,
		);

		expect(screen.queryByText('Test expandable content')).not.toBeInTheDocument();

		// Expand menu
		await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

		expect(screen.getByText('Test expandable content')).toBeVisible();

		// Collapse menu
		await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

		expect(screen.getByText('Test expandable content')).not.toBeVisible();
		expect(screen.getByText('Test expandable content')).toBeInTheDocument();
	});

	it('should show the expandable content on initial render when isDefaultExpanded is true', () => {
		render(
			<ExpandableMenuItem isDefaultExpanded>
				<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<ButtonMenuItem>Test expandable content</ButtonMenuItem>
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>,
		);

		expect(screen.getByText('Test expandable content')).toBeVisible();
	});

	describe('when nested', () => {
		it('should pass a11y checks', async () => {
			const { baseElement } = render(
				<NavWrapper>
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger>Top level trigger</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
							<ButtonMenuItem>Item 2</ButtonMenuItem>

							<ExpandableMenuItem isDefaultExpanded>
								<ExpandableMenuItemTrigger>Nested menu item trigger</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									<ButtonMenuItem>Item 3</ButtonMenuItem>
									<ButtonMenuItem>Item 4</ButtonMenuItem>
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</NavWrapper>,
			);

			await expect(baseElement).toBeAccessible();
		});

		it('should not show the nested content when only the top level expandable menu item is expanded', () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger>Top level trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Nested content level 1</ButtonMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger>Nested menu item trigger</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<ButtonMenuItem>Nested content level 2</ButtonMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByText('Nested content level 1')).toBeVisible();
			expect(screen.queryByText('Nested content level 2')).not.toBeInTheDocument();
		});

		it('should hide the nested content when the nested trigger is clicked', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger>Top level trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Nested content level 1</ButtonMenuItem>

						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger>Nested menu item trigger</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<ButtonMenuItem>Nested content level 2</ButtonMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByText('Nested content level 2')).toBeVisible();

			await userEvent.click(screen.getByRole('button', { name: /Nested menu item trigger/ }));

			expect(screen.getByText('Nested content level 2')).not.toBeVisible();
		});

		it('should retain the expanded state of nested expandable menu items when the ancestor is collapsed and then expanded again', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger>Top level trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Nested content level 1</ButtonMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger>Nested menu item trigger</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<ButtonMenuItem>Nested content level 2</ButtonMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.queryByText('Nested content level 2')).not.toBeInTheDocument();

			// Expand the nested expandable
			await userEvent.click(screen.getByRole('button', { name: /Nested menu item trigger/ }));

			expect(screen.getByText('Nested content level 2')).toBeVisible();

			// Collapse the top level expandable
			await userEvent.click(screen.getByRole('button', { name: /Top level trigger/ }));

			expect(screen.getByText('Nested content level 2')).not.toBeVisible();

			// Expand the top level expandable
			await userEvent.click(screen.getByRole('button', { name: /Top level trigger/ }));

			expect(screen.getByText('Nested content level 2')).toBeVisible();
		});
	});

	describe('when a href is provided', () => {
		it('should be a link', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test">Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByRole('link', { name: /Parent menu item/ })).toBeVisible();
		});

		it('should show the expandable content when the menu item trigger is clicked while collapsed', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test">Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('link', { name: /Parent menu item/ }));

			expect(screen.getByText('Test expandable content')).toBeVisible();
		});

		it('should hide the expandable content when the menu item trigger is clicked while expanded', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger href="/test">Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('link', { name: /Parent menu item/ }));

			expect(screen.getByText('Test expandable content')).not.toBeVisible();
		});

		it('should show the expandable content when the chevron icon button is clicked while collapsed', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test" testId="trigger-test-id">
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByTestId('trigger-test-id--elem-before-button'), {
				// Skipping pointer events check as the `:not(:has(button,a))` selector
				// to disable pointer-events when there is no interactive child element
				// is not working correctly in our unit test environment
				pointerEventsCheck: 0,
			});

			expect(screen.getByText('Test expandable content')).toBeVisible();
		});

		it('should hide the expandable content when the chevron icon button is clicked while expanded', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger href="/test" testId="trigger-test-id">
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByTestId('trigger-test-id--elem-before-button'), {
				// Skipping pointer events check as the `:not(:has(button,a))` selector
				// to disable pointer-events when there is no interactive child element
				// is not working correctly in our unit test environment
				pointerEventsCheck: 0,
			});

			expect(screen.getByText('Test expandable content')).not.toBeVisible();
		});

		it('should call the onExpansionToggle callback when the menu content is clicked', async () => {
			const onExpansionToggle = jest.fn();

			render(
				<ExpandableMenuItem onExpansionToggle={onExpansionToggle}>
					<ExpandableMenuItemTrigger href="/test">Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('link', { name: /Parent menu item/ }));

			expect(onExpansionToggle).toHaveBeenCalled();
		});

		it('should call the trigger click handler when the menu content is clicked', async () => {
			const onClick = jest.fn();

			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test" onClick={onClick}>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('link', { name: /Parent menu item/ }));

			expect(onClick).toHaveBeenCalled();
		});
	});

	describe('when a href is not provided', () => {
		it('should be a button', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByRole('button', { name: /Parent menu item/ })).toBeVisible();
		});

		it('should show the expandable content when the trigger label button is clicked while collapsed', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

			expect(screen.getByText('Test expandable content')).toBeVisible();
		});

		it('should hide the expandable content when the trigger label button is clicked while expanded', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

			expect(screen.getByText('Test expandable content')).not.toBeVisible();
		});

		it('should call the onExpansionToggle callback when the menu content is clicked', async () => {
			const onExpansionToggle = jest.fn();

			render(
				<ExpandableMenuItem onExpansionToggle={onExpansionToggle}>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

			expect(onExpansionToggle).toHaveBeenCalledWith(true);
		});

		it('should call the trigger click handler when the menu content is clicked', async () => {
			const onClick = jest.fn();

			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger onClick={onClick}>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			await userEvent.click(screen.getByRole('button', { name: /Parent menu item/ }));

			expect(onClick).toHaveBeenCalled();
		});

		describe('aria-expanded', () => {
			const itemText = 'Parent menu item';

			it('should be `false` when collapsed', () => {
				render(
					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger>{itemText}</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Test expandable content</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>,
				);

				expect(screen.getByRole('button', { name: itemText })).toHaveAttribute(
					'aria-expanded',
					'false',
				);
			});

			it('should be `true` when expanded', () => {
				render(
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger>{itemText}</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Test expandable content</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>,
				);

				expect(screen.getByRole('button', { name: itemText })).toHaveAttribute(
					'aria-expanded',
					'true',
				);
			});
		});
	});
});

describe('ExpandableMenuItemTrigger', () => {
	const scrollIntoViewMock = jest.fn();
	const scrollIntoViewIfNeededMock = jest.fn();

	beforeEach(() => {
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
		window.HTMLElement.prototype.scrollIntoViewIfNeeded = scrollIntoViewIfNeededMock;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const actions = [
		<IconButton key="Add" label="Add" icon={AddIcon} appearance="subtle" />,
		<IconButton key="More" label="More" icon={MoreIcon} appearance="subtle" />,
	];

	it('should be accessible', async () => {
		render(
			<NavWrapper>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" />} actions={actions}>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>
			</NavWrapper>,
		);

		await expect(screen.getByRole('button', { name: /Menu trigger/ })).toBeAccessible();
	});

	it('should display button with menu item label', () => {
		render(
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" />} actions={actions}>
					Menu trigger
				</ExpandableMenuItemTrigger>
			</ExpandableMenuItem>,
		);

		expect(screen.getByRole('button', { name: /Menu trigger/ })).toBeVisible();
	});

	describe('when a href is not provided', () => {
		it('should display custom icon when not hovered over', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon testId="test-icon" label="" />}>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('test-icon')).toBeVisible();
		});

		it('should display the collapsed chevron icon when trigger is hovered over while collapsed', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon testId="test-icon" label="" />}>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			await userEvent.hover(screen.getByRole('button', { name: /Menu trigger/ }));

			expect(screen.getByTestId('collapsed-icon')).toBeVisible();
		});

		it('should display the expanded chevron icon when trigger is hovered over while expanded', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon testId="test-icon" label="" />}>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			await userEvent.hover(screen.getByRole('button', { name: /Menu trigger/ }));

			expect(screen.getByTestId('expanded-icon')).toBeVisible();
		});

		it('should fallback to displaying the chevron icon when a custom icon is not provided', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Menu trigger</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('collapsed-icon')).toBeVisible();
		});
	});

	describe('when a href is provided', () => {
		it('should display an icon button with correct test id', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test" testId="trigger-test-id">
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('trigger-test-id--elem-before-button')).toBeVisible();
		});

		ffTest.on('platform_dst_expandable_menu_item_elembefore_label', 'aria-expanded', () => {
			it('should display an icon button with correct label and aria-expanded when expanded', () => {
				render(
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger
							href="/test"
							elemBefore={<HomeIcon label="" />}
							actions={actions}
						>
							Menu trigger
						</ExpandableMenuItemTrigger>
					</ExpandableMenuItem>,
				);

				const chevronIconButton = screen.getByRole('button', { name: /Menu trigger/ });

				expect(chevronIconButton).toBeVisible();
				expect(chevronIconButton).toHaveAttribute('aria-expanded', 'true');
			});

			it('should display an icon button with correct label and aria-expanded when collapsed', () => {
				render(
					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger
							href="/test"
							elemBefore={<HomeIcon label="" />}
							actions={actions}
						>
							Menu trigger
						</ExpandableMenuItemTrigger>
					</ExpandableMenuItem>,
				);

				const chevronIconButton = screen.getByRole('button', { name: /Menu trigger/ });

				expect(chevronIconButton).toBeVisible();
				expect(chevronIconButton).toHaveAttribute('aria-expanded', 'false');
			});
		});

		ffTest.off('platform_dst_expandable_menu_item_elembefore_label', 'aria-expanded', () => {
			const itemText = 'Parent menu item';
			const chevronExpandedText = 'Collapse';
			const chevronCollapsedText = 'Expand';

			it('should be `false` when collapsed', () => {
				render(
					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger href="/test">{itemText}</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Test expandable content</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>,
				);

				expect(screen.getByRole('button', { name: chevronCollapsedText })).toHaveAttribute(
					'aria-expanded',
					'false',
				);
			});

			it('should be `true` when expanded', () => {
				render(
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger href="/test">{itemText}</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Test expandable content</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>,
				);

				expect(screen.getByRole('button', { name: chevronExpandedText })).toHaveAttribute(
					'aria-expanded',
					'true',
				);
			});
		});

		it('should display custom icon when not hovered over', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon testId="test-icon" label="" />}
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('test-icon')).toBeVisible();
		});

		it('should display the collapsed chevron icon when trigger is hovered over while collapsed', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon testId="test-icon" label="" />}
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			await userEvent.hover(screen.getByRole('link', { name: /Menu trigger/ }));

			expect(screen.getByTestId('collapsed-icon')).toBeVisible();
		});

		it('should display the expanded chevron icon when trigger is hovered over while expanded', async () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon testId="test-icon" label="" />}
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			await userEvent.hover(screen.getByRole('link', { name: /Menu trigger/ }));

			expect(screen.getByTestId('expanded-icon')).toBeVisible();
		});

		it('should fallback to displaying the chevron icon when a custom icon is not provided', async () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="/test">Menu trigger</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('collapsed-icon')).toBeVisible();
		});

		it('should not scroll into view on initial render when not selected', () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon label="" />}
						actions={actions}
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewMock).not.toHaveBeenCalled();
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();
		});

		it('should fall back to using the scrollIntoView API when scrollIntoViewIfNeeded is not available', () => {
			window.HTMLElement.prototype.scrollIntoViewIfNeeded = undefined;

			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon label="" />}
						actions={actions}
						isSelected
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'nearest' });
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();
		});

		it('should scroll into view when selected on initial render', () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						href="/test"
						elemBefore={<HomeIcon label="" />}
						actions={actions}
						isSelected
					>
						Menu trigger
					</ExpandableMenuItemTrigger>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			// scrollIntoView is the fallback, so shouldn't be used if scrollIntoViewIfNeeded is available
			expect(scrollIntoViewMock).not.toHaveBeenCalled();
		});

		it('should scroll into view when selected after initial render', async () => {
			const TestComponent = () => {
				const [isSelected, setIsSelected] = useState(false);

				return (
					<>
						<button type="button" onClick={() => setIsSelected(true)}>
							Set selected
						</button>
						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger
								isSelected={isSelected}
								href="/test"
								elemBefore={<HomeIcon label="" />}
								actions={actions}
							>
								Menu trigger
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>
					</>
				);
			};

			render(<TestComponent />);
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			await userEvent.click(screen.getByRole('button', { name: 'Set selected' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			// scrollIntoView is the fallback, so shouldn't be used if scrollIntoViewIfNeeded is available
			expect(scrollIntoViewMock).not.toHaveBeenCalled();
		});

		it('should scroll into view when selected, even if collapsed', async () => {
			const TestComponent = () => {
				const [isSelected, setIsSelected] = useState(false);

				return (
					<>
						<button type="button" onClick={() => setIsSelected(true)}>
							Set selected
						</button>
						<ExpandableMenuItem isDefaultExpanded={false}>
							<ExpandableMenuItemTrigger
								isSelected={isSelected}
								href="/test"
								elemBefore={<HomeIcon label="" />}
								actions={actions}
							>
								Menu trigger
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>
					</>
				);
			};

			render(<TestComponent />);
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			await userEvent.click(screen.getByRole('button', { name: 'Set selected' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			// scrollIntoView is the fallback, so shouldn't be used if scrollIntoViewIfNeeded is available
			expect(scrollIntoViewMock).not.toHaveBeenCalled();
		});

		it('should scroll into view when selected, and nested in a parent menu item, and the parent gets expanded', async () => {
			// Ancestor is collapsed initially
			render(
				<ExpandableMenuItem isDefaultExpanded={false}>
					<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>

					<ExpandableMenuItemContent>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								isSelected
								href="/test"
								elemBefore={<HomeIcon label="" />}
								actions={actions}
							>
								Expandable trigger level 2
							</ExpandableMenuItemTrigger>
						</ExpandableMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
		});

		it('should scroll into view when selected, with multiple ancestors, and all ancestors become expanded', async () => {
			// Ancestor is collapsed initially
			render(
				<ExpandableMenuItem isDefaultExpanded={false}>
					<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>

					<ExpandableMenuItemContent>
						<ExpandableMenuItem isDefaultExpanded={false}>
							<ExpandableMenuItemTrigger
								href="/test"
								elemBefore={<HomeIcon label="" />}
								actions={actions}
							>
								Expandable trigger level 2
							</ExpandableMenuItemTrigger>

							<ExpandableMenuItemContent>
								<ExpandableMenuItem>
									<ExpandableMenuItemTrigger
										isSelected
										href="/test"
										elemBefore={<HomeIcon label="" />}
										actions={actions}
									>
										Expandable trigger level 3
									</ExpandableMenuItemTrigger>
								</ExpandableMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the first ancestor
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the second ancestor
			await userEvent.click(screen.getByRole('link', { name: 'Expandable trigger level 2' }));

			// Now that all ancestors are expanded, it should scroll into view
			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
		});

		it('should not scroll into view when parent expandable gets toggled again, until being unselected and re-selected', async () => {
			const TestComponent = () => {
				const [isSelected, setIsSelected] = useState(true);

				return (
					<>
						<ExpandableMenuItem isDefaultExpanded={false}>
							<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>

							<ExpandableMenuItemContent>
								<ExpandableMenuItem>
									<ExpandableMenuItemTrigger
										isSelected={isSelected}
										href="/test"
										elemBefore={<HomeIcon label="" />}
										actions={actions}
									>
										Expandable trigger level 2
									</ExpandableMenuItemTrigger>
								</ExpandableMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
						<button type="button" onClick={() => setIsSelected((val) => !val)}>
							Toggle selected
						</button>
					</>
				);
			};

			render(<TestComponent />);

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			scrollIntoViewIfNeededMock.mockClear();

			// Collapse then expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			// Should not scroll into view again
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Collapse the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			// Unselect then re-select the menu item
			await userEvent.click(screen.getByRole('button', { name: 'Toggle selected' }));
			await userEvent.click(screen.getByRole('button', { name: 'Toggle selected' }));

			// Expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			// Should scroll into view now
			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
		});
	});

	describe('isExpanded', () => {
		it('should render the content when isExpanded is true', () => {
			render(
				<ExpandableMenuItem isExpanded={true}>
					<ExpandableMenuItemTrigger>Trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Test expandable content')).toBeVisible();
		});

		it('should not render the content when isExpanded is false', () => {
			render(
				<ExpandableMenuItem isExpanded={false} isDefaultExpanded>
					<ExpandableMenuItemTrigger>Trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.queryByText('Test expandable content')).not.toBeInTheDocument();
		});

		it('should hide the content but leave it in the document when isOpen is updated to false after the initial render', () => {
			const { rerender } = render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger>Trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);
			// Initially, the content should be visible
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Test expandable content')).toBeVisible();
			// Update the isExpanded prop to false
			rerender(
				<ExpandableMenuItem isDefaultExpanded isExpanded={false}>
					<ExpandableMenuItemTrigger>Trigger</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);
			// Now, the content should not be visible, but remain in the document
			expect(screen.getByRole('button', { name: 'Trigger' })).toBeVisible();
			expect(screen.getByText('Test expandable content')).toBeInTheDocument();
			expect(screen.queryByText('Test expandable content')).not.toBeVisible();
		});
	});

	describe('actionsOnHover', () => {
		it('should hide elemAfter on hover', () => {
			render(
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						testId="expandable-menu-item"
						actionsOnHover={<IconButton icon={MoreIcon} label="label" />}
						elemAfter={<span>elemAfter</span>}
					>
						Trigger
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('expandable-menu-item-container')).not.toHaveCompiledCss(
				'--elem-after-display',
				'none',
			);
			expect(screen.getByTestId('expandable-menu-item-container')).toHaveCompiledCss(
				'--elem-after-display',
				'none',
				{ target: ':hover' },
			);
		});

		it('should hide elemAfter when expanded, if provided', () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						testId="expandable-menu-item"
						actionsOnHover={<IconButton icon={MoreIcon} label="label" />}
						elemAfter={<span>elemAfter</span>}
					>
						Trigger
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('expandable-menu-item-container')).toHaveCompiledCss(
				'--elem-after-display',
				'none',
			);
		});

		it('should not hide elemAfter if not provided', () => {
			render(
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						testId="expandable-menu-item"
						elemAfter={<span>elemAfter</span>}
					>
						Trigger
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Test expandable content</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(screen.getByTestId('expandable-menu-item-container')).not.toHaveCompiledCss(
				'--elem-after-display',
				'none',
			);
		});
	});
});

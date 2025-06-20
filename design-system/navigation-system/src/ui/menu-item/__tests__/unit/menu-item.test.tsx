import React, { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/add';
import JiraTestSessionIcon from '@atlaskit/icon/glyph/jira/test-session';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Lozenge from '@atlaskit/lozenge';

import { ButtonMenuItem } from '../../button-menu-item';
import { ExpandableMenuItem } from '../../expandable-menu-item/expandable-menu-item';
import { ExpandableMenuItemContent } from '../../expandable-menu-item/expandable-menu-item-content';
import { ExpandableMenuItemTrigger } from '../../expandable-menu-item/expandable-menu-item-trigger';
import { LinkMenuItem } from '../../link-menu-item';

describe('MenuItem', () => {
	const menuItemText = 'Test';
	const actionAddLabel = 'Add';
	const actionMoreLabel = 'More';
	const actions = [
		<IconButton key={actionAddLabel} label={actionAddLabel} icon={AddIcon} appearance="subtle" />,
		<IconButton
			key={actionMoreLabel}
			label={actionMoreLabel}
			icon={MoreIcon}
			appearance="subtle"
		/>,
	];
	const interactiveElemText = 'IconButton text';
	const actionsOnHoverText = 'Actions on hover';
	const lozengeText = 'Lozenge';
	const descriptionText = 'Example description';
	const testId = 'menu-item-testid';
	const containerTestId = testId + '-container';

	describe('ButtonMenuItem', () => {
		it('should render', () => {
			render(<ButtonMenuItem>{menuItemText}</ButtonMenuItem>);
			expect(screen.getByRole('button', { name: menuItemText })).toBeVisible();
		});

		it('should be accessible', async () => {
			render(<ButtonMenuItem>{menuItemText}</ButtonMenuItem>);
			await expect(screen.getByRole('button', { name: menuItemText })).toBeAccessible();
		});

		it('should render a description if provided', () => {
			render(<ButtonMenuItem description={descriptionText}>{menuItemText}</ButtonMenuItem>);
			expect(screen.getByText(descriptionText)).toBeVisible();
		});

		describe('elemBefore', () => {
			it('should render an avatar if provided', () => {
				render(
					<ButtonMenuItem elemBefore={<Avatar testId={testId} size="small" />}>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should render an icon if provided', () => {
				render(
					<ButtonMenuItem elemBefore={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should not share same button interaction', () => {
				render(
					<ButtonMenuItem elemBefore={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</ButtonMenuItem>,
				);
				const interactiveElement = screen.getByRole('button');
				const icon = screen.getByTestId(testId);
				expect(interactiveElement).not.toContainElement(icon);
			});

			it('should render an icon button if provided', () => {
				render(
					<ButtonMenuItem
						elemBefore={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByRole('button', { name: interactiveElemText })).toBeVisible();
			});
		});

		it('should render actions if provided', () => {
			render(<ButtonMenuItem actions={actions}>{menuItemText}</ButtonMenuItem>);
			expect(screen.getByRole('button', { name: actionAddLabel })).toBeVisible();
			expect(screen.getByRole('button', { name: actionMoreLabel })).toBeVisible();
		});

		describe('elemAfter', () => {
			it('should render an icon if provided', () => {
				render(
					<ButtonMenuItem elemAfter={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should render a lozenge if provided', () => {
				render(
					<ButtonMenuItem elemAfter={<Lozenge>{lozengeText}</Lozenge>}>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByText(lozengeText)).toBeVisible();
			});
		});

		describe('actionsOnHover', () => {
			it('should render an icon button if provided', () => {
				render(
					<ButtonMenuItem
						actionsOnHover={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByRole('button', { name: interactiveElemText })).toBeInTheDocument();
			});
		});

		describe('disabled state', () => {
			it('should not be interactive when disabled', async () => {
				const onClick = jest.fn();
				render(
					<ButtonMenuItem isDisabled onClick={onClick}>
						Menu item label
					</ButtonMenuItem>,
				);

				await userEvent.click(screen.getByRole('button', { name: /Menu item label/ }));
				expect(onClick).not.toHaveBeenCalled();
			});

			it('should not render actions when disabled', () => {
				render(
					<ButtonMenuItem
						isDisabled
						actions={<IconButton icon={JiraTestSessionIcon} label="Test action" />}
					>
						Menu item label
					</ButtonMenuItem>,
				);

				expect(screen.queryByRole('button', { name: /Test action/ })).not.toBeInTheDocument();
			});

			it('should not render actionsOnHover when disabled', () => {
				render(
					<ButtonMenuItem
						isDisabled
						actionsOnHover={<IconButton icon={JiraTestSessionIcon} label="Test action" />}
					>
						Menu item label
					</ButtonMenuItem>,
				);

				expect(screen.queryByRole('button', { name: /Test action/ })).not.toBeInTheDocument();
			});
		});

		it('should call click handler when clicked', async () => {
			const onClick = jest.fn();
			render(<ButtonMenuItem onClick={onClick}>{menuItemText}</ButtonMenuItem>);

			await userEvent.click(screen.getByRole('button', { name: menuItemText }));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should focus on the interactive elements in the correct order', async () => {
			render(
				<ButtonMenuItem
					elemBefore={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					actions={actions}
					actionsOnHover={<IconButton icon={JiraTestSessionIcon} label={actionsOnHoverText} />}
				>
					{menuItemText}
				</ButtonMenuItem>,
			);

			await userEvent.tab();
			expect(screen.getByRole('button', { name: menuItemText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: interactiveElemText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionsOnHoverText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionAddLabel })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionMoreLabel })).toHaveFocus();
		});

		// Note: not adding tests for whether elements in slots (eg `elemBefore`) have
		// `pointer-events:none` on it as our creative selector
		// `:not(:has(button,a))` is not working with `.toHaveCompiledCss()`
	});

	describe('LinkMenuItem', () => {
		const href = 'http://www.atlassian.design';
		const scrollIntoViewMock = jest.fn();
		const scrollIntoViewIfNeededMock = jest.fn();

		beforeEach(() => {
			window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
			window.HTMLElement.prototype.scrollIntoViewIfNeeded = scrollIntoViewIfNeededMock;
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should render', () => {
			render(<LinkMenuItem href={href}>{menuItemText}</LinkMenuItem>);
			expect(screen.getByRole('link', { name: menuItemText })).toBeVisible();
		});

		it('should be accessible', async () => {
			render(<LinkMenuItem href={href}>{menuItemText}</LinkMenuItem>);
			await expect(screen.getByRole('link', { name: menuItemText })).toBeAccessible();
		});

		it('should render a description if provided', () => {
			render(
				<LinkMenuItem href={href} description={descriptionText}>
					{menuItemText}
				</LinkMenuItem>,
			);
			expect(screen.getByText(descriptionText)).toBeVisible();
		});

		it('should set `aria-current` if item is for current page', () => {
			const unselectedText = 'unselected';

			render(
				<>
					<LinkMenuItem href={href} isSelected>
						{menuItemText}
					</LinkMenuItem>
					,<LinkMenuItem href={href}>{unselectedText}</LinkMenuItem>,
				</>,
			);
			expect(screen.getByRole('link', { name: menuItemText })).toHaveAttribute(
				'aria-current',
				'page',
			);
			expect(screen.getByRole('link', { name: unselectedText })).not.toHaveAttribute(
				'aria-current',
			);
		});

		it('should add `data-selected` to the container node', () => {
			render(
				<LinkMenuItem href={href} isSelected testId={testId}>
					{menuItemText}
				</LinkMenuItem>,
			);

			const itemContainer = screen.getByTestId(containerTestId);
			expect(itemContainer).toBeVisible();

			expect(itemContainer).toHaveAttribute('data-selected', 'true');
		});

		it('should add data attribute `data-selected` if item is selected', () => {
			render(
				<LinkMenuItem href={href} isSelected>
					{menuItemText}
				</LinkMenuItem>,
			);

			const selectedLink = screen.getByRole('link', { name: menuItemText });
			expect(selectedLink).toBeVisible();
			// eslint-disable-next-line testing-library/no-node-access
			expect(selectedLink.closest('[data-selected]')).toHaveAttribute('data-selected', 'true');
		});

		it('should not add data attribute `data-selected` if item is not selected', () => {
			const unselectedText = 'unselected';

			render(<LinkMenuItem href={href}>{unselectedText}</LinkMenuItem>);

			const unselectedLink = screen.getByRole('link', { name: unselectedText });
			expect(unselectedLink).toBeVisible();

			// eslint-disable-next-line testing-library/no-node-access
			expect(unselectedLink.closest('[data-selected]')).toBeNull();
		});

		it('should not scroll into view on initial render when not selected', () => {
			render(<LinkMenuItem href={href}>{menuItemText}</LinkMenuItem>);

			expect(scrollIntoViewMock).not.toHaveBeenCalled();
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();
		});

		it('should fall back to using the scrollIntoView API when scrollIntoViewIfNeeded is not available', () => {
			window.HTMLElement.prototype.scrollIntoViewIfNeeded = undefined;

			render(
				<LinkMenuItem href={href} isSelected>
					{menuItemText}
				</LinkMenuItem>,
			);

			expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'nearest' });
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();
		});

		it('should use the scrollIntoViewIfNeeded API when available', () => {
			render(
				<LinkMenuItem href={href} isSelected>
					{menuItemText}
				</LinkMenuItem>,
			);

			expect(scrollIntoViewMock).not.toHaveBeenCalled();
		});

		it('should scroll into view on initial render when selected', () => {
			render(
				<LinkMenuItem href={href} isSelected>
					{menuItemText}
				</LinkMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			// scrollIntoView is the fallback, so shouldn't be used when scrollIntoViewIfNeeded is available
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
						<LinkMenuItem href={href} isSelected={isSelected}>
							{menuItemText}
						</LinkMenuItem>
					</>
				);
			};

			render(<TestComponent />);
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			await userEvent.click(screen.getByRole('button', { name: 'Set selected' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
			// scrollIntoView is the fallback, so shouldn't be used when scrollIntoViewIfNeeded is available
			expect(scrollIntoViewMock).not.toHaveBeenCalled();
		});

		it('should scroll into view when selected and the parent expandable menu item gets expanded', async () => {
			// Ancestor is collapsed initially
			render(
				<ExpandableMenuItem isDefaultExpanded={false}>
					<ExpandableMenuItemTrigger>Expandable trigger</ExpandableMenuItemTrigger>

					<ExpandableMenuItemContent>
						<LinkMenuItem href={href} isSelected>
							{menuItemText}
						</LinkMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
		});

		it('should scroll into view when selected, with multiple ancestors, and all ancestors become expanded', async () => {
			// Ancestors are all collapsed initially
			render(
				<ExpandableMenuItem isDefaultExpanded={false}>
					<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>

					<ExpandableMenuItemContent>
						<ExpandableMenuItem isDefaultExpanded={false}>
							<ExpandableMenuItemTrigger>Expandable trigger level 2</ExpandableMenuItemTrigger>

							<ExpandableMenuItemContent>
								<LinkMenuItem href={href} isSelected>
									{menuItemText}
								</LinkMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
						,
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>,
			);

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the first ancestor
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 1' }));

			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Expand the second ancestor
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger level 2' }));

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
							<ExpandableMenuItemTrigger>Expandable trigger</ExpandableMenuItemTrigger>

							<ExpandableMenuItemContent>
								<LinkMenuItem href={href} isSelected={isSelected}>
									{menuItemText}
								</LinkMenuItem>
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
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));

			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);

			scrollIntoViewIfNeededMock.mockClear();

			// Collapse then expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));

			// Should not scroll into view again
			expect(scrollIntoViewIfNeededMock).not.toHaveBeenCalled();

			// Collapse the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));

			// Unselect then re-select the menu item
			await userEvent.click(screen.getByRole('button', { name: 'Toggle selected' }));
			await userEvent.click(screen.getByRole('button', { name: 'Toggle selected' }));

			// Expand the parent
			await userEvent.click(screen.getByRole('button', { name: 'Expandable trigger' }));

			// Should scroll into view now
			expect(scrollIntoViewIfNeededMock).toHaveBeenCalledWith(
				true, // The arg is for centering the element
			);
		});

		describe('elemBefore', () => {
			it('should render an avatar if provided', () => {
				render(
					<LinkMenuItem href={href} elemBefore={<Avatar testId={testId} size="small" />}>
						{menuItemText}
					</LinkMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should render an icon if provided', () => {
				render(
					<LinkMenuItem href={href} elemBefore={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</LinkMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should render an icon button if provided', () => {
				render(
					<ButtonMenuItem
						elemBefore={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					>
						{menuItemText}
					</ButtonMenuItem>,
				);
				expect(screen.getByRole('button', { name: interactiveElemText })).toBeVisible();
			});

			it('should not share same link interaction', () => {
				render(
					<LinkMenuItem href={href} elemBefore={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</LinkMenuItem>,
				);
				const interactiveElement = screen.getByRole('link');
				const icon = screen.getByTestId(testId);
				expect(interactiveElement).not.toContainElement(icon);
			});
		});

		it('should render actions if provided', () => {
			render(
				<LinkMenuItem href={href} actions={actions}>
					{menuItemText}
				</LinkMenuItem>,
			);
			expect(screen.getByRole('button', { name: actionAddLabel })).toBeVisible();
			expect(screen.getByRole('button', { name: actionMoreLabel })).toBeVisible();
		});

		describe('elemAfter', () => {
			it('should render an icon if provided', () => {
				render(
					<LinkMenuItem href={href} elemAfter={<JiraTestSessionIcon label="" testId={testId} />}>
						{menuItemText}
					</LinkMenuItem>,
				);
				expect(screen.getByTestId(testId)).toBeVisible();
			});

			it('should render a lozenge if provided', () => {
				render(
					<LinkMenuItem href={href} elemAfter={<Lozenge>{lozengeText}</Lozenge>}>
						{menuItemText}
					</LinkMenuItem>,
				);
				expect(screen.getByText(lozengeText)).toBeVisible();
			});
		});

		describe('actionsOnHover', () => {
			it('should render an icon button if provided', () => {
				render(
					<LinkMenuItem
						href={href}
						actionsOnHover={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					>
						{menuItemText}
					</LinkMenuItem>,
				);
				expect(screen.getByRole('button', { name: interactiveElemText })).toBeInTheDocument();
			});
		});

		it('should call click handler when clicked', async () => {
			const onClick = jest.fn();
			render(
				<LinkMenuItem href={href} onClick={onClick}>
					{menuItemText}
				</LinkMenuItem>,
			);

			await userEvent.click(screen.getByRole('link', { name: menuItemText }));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should open in new window if `target` is `_blank`', () => {
			render(
				<LinkMenuItem href={href} target="_blank">
					{menuItemText}
				</LinkMenuItem>,
			);

			const link = screen.getByRole('link');
			expect(link).toHaveAttribute('target', '_blank');
		});

		it('should add hidden text that says it will open in a new window if `target` is `_blank', () => {
			render(
				<LinkMenuItem href={href} target="_blank">
					{menuItemText}
				</LinkMenuItem>,
			);

			const newWindowTextMatcher = /opens new window/i;
			expect(menuItemText).not.toMatch(newWindowTextMatcher);
			const link = screen.getByRole('link');
			expect(link).toHaveAccessibleName(newWindowTextMatcher);
		});

		it('should focus on the interactive elements in the correct order', async () => {
			render(
				<LinkMenuItem
					href={href}
					elemBefore={<IconButton icon={JiraTestSessionIcon} label={interactiveElemText} />}
					actions={actions}
					actionsOnHover={<IconButton icon={JiraTestSessionIcon} label={actionsOnHoverText} />}
				>
					{menuItemText}
				</LinkMenuItem>,
			);

			await userEvent.tab();
			expect(screen.getByRole('link', { name: menuItemText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: interactiveElemText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionsOnHoverText })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionAddLabel })).toHaveFocus();

			await userEvent.tab();
			expect(screen.getByRole('button', { name: actionMoreLabel })).toHaveFocus();
		});
	});
});

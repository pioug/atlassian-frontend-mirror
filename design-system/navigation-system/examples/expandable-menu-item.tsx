/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import ClockIcon from '@atlaskit/icon/core/clock';
import HomeIcon from '@atlaskit/icon/core/home';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { MenuList } from '@atlaskit/navigation-system';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		width: '300px',
	},
	wrapper: {
		paddingBlockEnd: token('space.150'),
	},
});

const AddAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	<DropdownMenu
		shouldRenderToParent={shouldRenderToParent}
		trigger={({ triggerRef, ...props }) => (
			<IconButton
				ref={triggerRef}
				{...props}
				spacing="compact"
				appearance="subtle"
				label="Add"
				icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Create</DropdownItem>
			<DropdownItem>Import</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	<DropdownMenu
		shouldRenderToParent={shouldRenderToParent}
		trigger={({ triggerRef, ...props }) => (
			<IconButton
				ref={triggerRef}
				{...props}
				spacing="compact"
				appearance="subtle"
				label="More"
				icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
			/>
		)}
	>
		<DropdownItemGroup>
			<DropdownItem>Manage starred</DropdownItem>
			<DropdownItem>Export</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);

const MockActions = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (
	<>
		<AddAction shouldRenderToParent={shouldRenderToParent} />
		<MoreAction shouldRenderToParent={shouldRenderToParent} />
	</>
);

export const ExpandableMenuItemUnselectable = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

const ExpandableMenuItemControlled = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<ExpandableMenuItem
						isExpanded={isExpanded}
						onExpansionToggle={() => setIsExpanded((value) => !value)}
					>
						<ExpandableMenuItemTrigger href="#">Parent menu item</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<ButtonMenuItem>Item 1</ButtonMenuItem>
							<ButtonMenuItem>Item 2</ButtonMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</MenuList>
			</SideNavContent>
		</div>
	);
};

export const ExpandableMenuItemSelectable = () => {
	const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);

	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<ExpandableMenuItem>
						<ExpandableMenuItemTrigger
							href="#test"
							isSelected={selectedMenuItemId === 'trigger'}
							onClick={() => setSelectedMenuItemId('trigger')}
						>
							Parent menu item
						</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<LinkMenuItem
								href="#test"
								isSelected={selectedMenuItemId === 'item-1'}
								onClick={() => setSelectedMenuItemId('item-1')}
							>
								Item 1
							</LinkMenuItem>
							<LinkMenuItem
								href="#test"
								isSelected={selectedMenuItemId === 'item-2'}
								onClick={() => setSelectedMenuItemId('item-2')}
							>
								Item 2
							</LinkMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</MenuList>
			</SideNavContent>
		</div>
	);
};

export const ExpandableMenuItemSelected = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="#test" isSelected>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemWithIcon = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" color={token('color.icon')} />}>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemSelectedWithIcon = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						href="#test"
						isSelected
						elemBefore={<HomeIcon label="" color={token('color.icon.selected')} />}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						href="#test"
						isSelected
						elemBefore={<HomeIcon label="" color="currentColor" />}
					>
						Parent menu item (with currentColor)
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemWithElemAfter = ({ isExpanded }: { isExpanded?: boolean }) => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem isDefaultExpanded={isExpanded}>
					<ExpandableMenuItemTrigger
						elemBefore={<HomeIcon label="" color={token('color.icon')} />}
						elemAfter={<Lozenge>Elem after</Lozenge>}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemExpandedWithElemAfter = () => (
	<ExpandableMenuItemWithElemAfter isExpanded />
);

export const ExpandableMenuItemWithActions = ({ isSelected }: { isSelected?: boolean }) => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						href="#test"
						actions={<MockActions shouldRenderToParent />}
						testId="menu-item-trigger"
						isSelected={isSelected}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

const ExpandableMenuItemSelectedWithActions = () => <ExpandableMenuItemWithActions isSelected />;

export const ExpandableMenuItemWithActionsOnHover = ({
	isSelected,
	isExpanded,
}: {
	isExpanded?: boolean;
	isSelected?: boolean;
}) => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem isExpanded={isExpanded}>
					<ExpandableMenuItemTrigger
						href="#test"
						actionsOnHover={<MockActions shouldRenderToParent />}
						testId="menu-item-trigger"
						isSelected={isSelected}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemExpandedWithActionsOnHover = () => (
	<ExpandableMenuItemWithActionsOnHover isExpanded />
);

export const ExpandableMenuItemSelectedWithActionsOnHover = () => (
	<ExpandableMenuItemWithActionsOnHover isSelected />
);

export const ExpandableMenuItemWithActionsOnHoverAndElemAfter = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						actionsOnHover={<MockActions shouldRenderToParent />}
						testId="menu-item-trigger"
						elemAfter={<Lozenge>Elem after</Lozenge>}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemWithActionsAndElemAfter = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						actions={<MockActions shouldRenderToParent />}
						testId="menu-item-trigger"
						elemAfter={<Lozenge>Elem after</Lozenge>}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem isExpanded>
					<ExpandableMenuItemTrigger
						actionsOnHover={<MockActions shouldRenderToParent />}
						testId="menu-item-trigger"
						elemAfter={<span>elemAfter</span>}
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemNested = ({
	hasItemInitiallySelected = true,
}: {
	hasItemInitiallySelected?: boolean;
}) => {
	const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(
		hasItemInitiallySelected ? 'item-4' : null,
	);

	return (
		<div css={styles.root}>
			<SideNavContent>
				<MenuList>
					<ExpandableMenuItem isDefaultExpanded>
						<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>
						<ExpandableMenuItemContent>
							<LinkMenuItem
								href="#test"
								isSelected={selectedMenuItemId === 'item-1'}
								onClick={() => {
									setSelectedMenuItemId('item-1');
								}}
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							>
								Item 1
							</LinkMenuItem>
							<LinkMenuItem
								href="#test"
								isSelected={selectedMenuItemId === 'item-2'}
								onClick={() => {
									setSelectedMenuItemId('item-2');
								}}
								elemBefore={<ClockIcon label="" color="currentColor" spacing="spacious" />}
							>
								Item 2
							</LinkMenuItem>
							<ExpandableMenuItem isDefaultExpanded>
								<ExpandableMenuItemTrigger
									isSelected={selectedMenuItemId === 'trigger-level-2'}
									onClick={() => {
										setSelectedMenuItemId('trigger-level-2');
									}}
									href="#test"
								>
									Expandable trigger level 2 (selectable)
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									<LinkMenuItem
										href="#test"
										isSelected={selectedMenuItemId === 'item-3'}
										onClick={() => {
											setSelectedMenuItemId('item-3');
										}}
										actionsOnHover={<MockActions shouldRenderToParent />}
									>
										Item 3
									</LinkMenuItem>
									<ExpandableMenuItem isDefaultExpanded>
										<ExpandableMenuItemTrigger
											isSelected={selectedMenuItemId === 'trigger-level-3'}
											onClick={() => {
												setSelectedMenuItemId('trigger-level-3');
											}}
											href="#test"
										>
											Expandable trigger level 3 (selectable)
										</ExpandableMenuItemTrigger>
										<ExpandableMenuItemContent>
											<LinkMenuItem
												href="#test"
												isSelected={selectedMenuItemId === 'item-4'}
												elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
												onClick={() => {
													setSelectedMenuItemId('item-4');
												}}
											>
												Item 4
											</LinkMenuItem>
											<LinkMenuItem
												href="#test"
												isSelected={selectedMenuItemId === 'item-5'}
												onClick={() => {
													setSelectedMenuItemId('item-5');
												}}
												actions={<MockActions shouldRenderToParent />}
											>
												Item 5
											</LinkMenuItem>

											<ExpandableMenuItem>
												<ExpandableMenuItemTrigger>
													Expandable trigger level 4
												</ExpandableMenuItemTrigger>
												<ExpandableMenuItemContent>
													<LinkMenuItem
														href="#test"
														isSelected={selectedMenuItemId === 'item-6'}
														onClick={() => {
															setSelectedMenuItemId('item-6');
														}}
													>
														Item 6
													</LinkMenuItem>
													<LinkMenuItem
														href="#test"
														isSelected={selectedMenuItemId === 'item-7'}
														onClick={() => {
															setSelectedMenuItemId('item-7');
														}}
													>
														Item 7
													</LinkMenuItem>
												</ExpandableMenuItemContent>
											</ExpandableMenuItem>
										</ExpandableMenuItemContent>
									</ExpandableMenuItem>
									<LinkMenuItem
										href="#test"
										isSelected={selectedMenuItemId === 'item-8'}
										onClick={() => {
											setSelectedMenuItemId('item-8');
										}}
									>
										Item 8
									</LinkMenuItem>
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
						</ExpandableMenuItemContent>
					</ExpandableMenuItem>
				</MenuList>
			</SideNavContent>
			<Button
				onClick={() => {
					setSelectedMenuItemId(null);
				}}
			>
				Clear selection
			</Button>
		</div>
	);
};

export const ExpandableMenuItemNestedNoSelection = () => (
	<ExpandableMenuItemNested hasItemInitiallySelected={false} />
);

export const ExpandableMenuItemNestedRTL = () => (
	<div dir="rtl">
		<ExpandableMenuItemNested />
	</div>
);

export const ExpandableMenuItemCollapsedWithSelectedChild = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<LinkMenuItem href="#test" isSelected>
							Selected item
						</LinkMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" color={token('color.icon')} />}>
						Parent menu item with elemBefore
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<LinkMenuItem href="#test" isSelected>
							Selected item
						</LinkMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemLink = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger href="#">Parent menu item</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemWithAllOptions = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						elemBefore={<HomeIcon label="" color={token('color.icon')} />}
						actions={<AddAction shouldRenderToParent />}
						actionsOnHover={<MoreAction shouldRenderToParent />}
						elemAfter={<Lozenge>Elem after</Lozenge>}
						href="#"
						testId="parent-menu-item"
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

const ExpandableMenuItemWithAllOptionsPortalledPopups = () => (
	<div css={styles.root}>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem>
					<ExpandableMenuItemTrigger
						elemBefore={<HomeIcon label="" color={token('color.icon')} />}
						actions={<AddAction shouldRenderToParent={false} />}
						actionsOnHover={<MoreAction shouldRenderToParent={false} />}
						elemAfter={<Lozenge>Elem after</Lozenge>}
						href="#"
					>
						Parent menu item
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<ButtonMenuItem>Item 1</ButtonMenuItem>
						<ButtonMenuItem>Item 2</ButtonMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</div>
);

export const ExpandableMenuItemWithDropdownActionOpen = ({
	isSelected,
}: {
	isSelected?: boolean;
}) => (
	<div css={styles.root}>
		<MenuList>
			<ExpandableMenuItem>
				<ExpandableMenuItemTrigger
					href="#test"
					isSelected={isSelected}
					elemBefore={<HomeIcon label="" color={token('color.icon')} />}
					actions={
						<DropdownMenu
							defaultOpen
							shouldRenderToParent
							trigger={({ triggerRef, ...props }) => (
								<IconButton
									ref={triggerRef}
									{...props}
									spacing="compact"
									appearance="subtle"
									label="More"
									icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
								/>
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Manage starred</DropdownItem>
								<DropdownItem>Export</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					}
				>
					Parent menu item
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<ButtonMenuItem>Item 1</ButtonMenuItem>
					<ButtonMenuItem>Item 2</ButtonMenuItem>
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>
		</MenuList>
	</div>
);

export const ExpandableMenuItemSelectedWithDropdownActionOpen = () => (
	<ExpandableMenuItemWithDropdownActionOpen isSelected />
);

const ExampleWrapper = ({ children }: { children: React.ReactNode }) => (
	<div css={styles.wrapper}>{children}</div>
);

// Combining into one example for atlaskit site
const Example = () => (
	<div>
		<ExampleWrapper>
			Unselectable
			<ExpandableMenuItemUnselectable />
		</ExampleWrapper>
		<ExampleWrapper>
			Selectable
			<ExpandableMenuItemSelectable />
		</ExampleWrapper>
		<ExampleWrapper>
			Selected
			<ExpandableMenuItemSelected />
		</ExampleWrapper>
		<ExampleWrapper>
			With icon (elemBefore)
			<ExpandableMenuItemWithIcon />
		</ExampleWrapper>
		<ExampleWrapper>
			Selected with icon (elemBefore)
			<ExpandableMenuItemSelectedWithIcon />
		</ExampleWrapper>
		<ExampleWrapper>
			With element after (elemAfter)
			<ExpandableMenuItemWithElemAfter />
		</ExampleWrapper>
		<ExampleWrapper>
			With actions
			<ExpandableMenuItemWithActions />
		</ExampleWrapper>
		<ExampleWrapper>
			Selected with actions
			<ExpandableMenuItemSelectedWithActions />
		</ExampleWrapper>
		<ExampleWrapper>
			With actions on hover
			<ExpandableMenuItemWithActionsOnHover />
		</ExampleWrapper>
		<ExampleWrapper>
			Selected with actions on hover
			<ExpandableMenuItemSelectedWithActionsOnHover />
		</ExampleWrapper>
		<ExampleWrapper>
			Expanded with actions on hover
			<ExpandableMenuItemExpandedWithActionsOnHover />
		</ExampleWrapper>
		<ExampleWrapper>
			With actions on hover and element after
			<ExpandableMenuItemWithActionsOnHoverAndElemAfter />
		</ExampleWrapper>
		<ExampleWrapper>
			Expanded with actions on hover and element after
			<ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter />
		</ExampleWrapper>
		<ExampleWrapper>
			With actions and element after
			<ExpandableMenuItemWithActionsAndElemAfter />
		</ExampleWrapper>
		<ExampleWrapper>
			Nested
			<ExpandableMenuItemNested />
		</ExampleWrapper>
		<ExampleWrapper>
			<div dir="rtl">Nested RTL</div>
			<ExpandableMenuItemNestedRTL />
		</ExampleWrapper>
		<ExampleWrapper>
			Collapsed with selected child
			<ExpandableMenuItemCollapsedWithSelectedChild />
		</ExampleWrapper>
		<ExampleWrapper>
			Expandable link
			<ExpandableMenuItemLink />
		</ExampleWrapper>
		<ExampleWrapper>
			Expandable with all options
			<ExpandableMenuItemWithAllOptions />
		</ExampleWrapper>
		<ExampleWrapper>
			Expandable with all options (portalled popups)
			<ExpandableMenuItemWithAllOptionsPortalledPopups />
		</ExampleWrapper>
		<ExampleWrapper>
			Controlled
			<ExpandableMenuItemControlled />
		</ExampleWrapper>
	</div>
);

export default Example;

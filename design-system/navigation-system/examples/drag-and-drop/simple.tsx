/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, type Ref, useEffect, useRef, useState } from 'react';

import invariant from 'tiny-invariant';

import { IconButton } from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import BasketballIcon from '@atlaskit/icon/core/basketball';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import FilterIcon from '@atlaskit/icon/core/filter';
import GrowVerticalIcon from '@atlaskit/icon/core/grow-vertical';
import ProjectIcon from '@atlaskit/icon/core/project';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import TagIcon from '@atlaskit/icon/core/tag';
import {
	ButtonMenuItem,
	LinkMenuItem,
	MenuList,
	SideNavContent,
} from '@atlaskit/navigation-system';
import { DropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/drop-indicator';
import { GroupDropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';
import { useMenuItemDragAndDrop } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import {
	dropTargetForElements,
	type ElementDropTargetEventBasePayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { token } from '@atlaskit/tokens';

import { SidebarExampleContainer } from './sidebar-example-container';

function ReorderMenu({ onClose }: { onClose?: () => void }) {
	return (
		<DropdownMenu
			shouldRenderToParent
			placement="right-start"
			trigger={({ triggerRef, ...triggerProps }) => (
				<DropdownItem
					{...triggerProps}
					ref={triggerRef}
					elemBefore={<GrowVerticalIcon label="" />}
					elemAfter={<ChevronRightIcon color={token('color.icon.subtle')} label="" size="small" />}
				>
					<span>Reorder</span>
				</DropdownItem>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem onClick={onClose}>Move to top</DropdownItem>
				<DropdownItem onClick={onClose}>Move up</DropdownItem>
				<DropdownItem onClick={onClose}>Move down</DropdownItem>
				<DropdownItem onClick={onClose}>Move to bottom</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

function FakeMoreMenu() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<DropdownMenu
			shouldRenderToParent
			isOpen={isOpen}
			onOpenChange={() => setIsOpen((current) => !current)}
			trigger={({ triggerRef, ...triggerProps }) => (
				<IconButton
					ref={triggerRef as Ref<HTMLButtonElement>}
					label="More actions"
					icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
					spacing="compact"
					appearance="subtle"
					{...triggerProps}
				/>
			)}
		>
			<DropdownItemGroup hasSeparator>
				<DropdownItem elemBefore={<SettingsIcon label="" />}>Settings</DropdownItem>
				<DropdownItem elemBefore={<TagIcon label="" />}>Add label</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<ReorderMenu onClose={() => setIsOpen(false)} />
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

function OurLinkMenuItem({
	forcedDropIndicator,
	testId,
}: {
	forcedDropIndicator?: ReactNode;
	testId?: string;
}) {
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => ({ type: 'menu-item' }),
				getDragPreviewPieces: () => ({
					elemBefore: <ProjectIcon label="" />,
					content: 'Link menu item',
				}),
			},
			dropTarget: {
				getData: () => ({ type: 'menu-item' }),
				getOperations: () => ({
					'reorder-before': 'available',
					combine: 'available',
					'reorder-after': 'available',
				}),
				canDrop: ({ source }) => source.data.type === 'menu-item',
			},
		});

	return (
		<>
			<LinkMenuItem
				href="#"
				testId={testId}
				elemBefore={<ProjectIcon label="" />}
				ref={draggableAnchorRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={forcedDropIndicator || dropIndicator}
				visualContentRef={dropTargetRef}
				actionsOnHover={<FakeMoreMenu />}
			>
				Link menu item
			</LinkMenuItem>
			{dragPreview}
		</>
	);
}

function OurButtonMenuItem({
	testId,
	forcedDropIndicator,
}: {
	testId?: string;
	forcedDropIndicator?: ReactNode;
}) {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => ({ type: 'menu-item' }),
				getDragPreviewPieces: () => ({
					elemBefore: <BasketballIcon label="" />,
					content: 'Button menu item',
				}),
			},
			dropTarget: {
				canDrop: ({ source }) => source.data.type === 'menu-item',
				getData: () => ({ type: 'menu-item' }),
				getOperations: () => ({
					'reorder-before': 'available',
					combine: 'available',
					'reorder-after': 'available',
				}),
			},
		});

	return (
		<>
			<ButtonMenuItem
				testId={testId}
				elemBefore={<BasketballIcon label="" />}
				ref={draggableButtonRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={forcedDropIndicator || dropIndicator}
				visualContentRef={dropTargetRef}
				actionsOnHover={<FakeMoreMenu />}
			>
				Button menu item
			</ButtonMenuItem>
			{dragPreview}
		</>
	);
}

function OurFlyoutMenuItem({
	triggerTestId,
	forcedDropIndicator,
}: {
	triggerTestId?: string;
	forcedDropIndicator?: ReactNode;
}) {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getDragPreviewPieces: () => ({
					elemBefore: <StarUnstarredIcon label="" />,
					content: 'Flyout menu item',
				}),
				getInitialData: () => ({ type: 'menu-item' }),
			},
			dropTarget: {
				getData: () => ({ type: 'menu-item' }),
				getOperations: () => ({
					'reorder-before': 'available',
					combine: 'available',
					'reorder-after': 'available',
				}),
				canDrop: ({ source }) => source.data.type === 'menu-item',
			},
		});

	return (
		<>
			<FlyoutMenuItem>
				<FlyoutMenuItemTrigger
					testId={triggerTestId}
					elemBefore={<StarUnstarredIcon label="" />}
					ref={draggableButtonRef}
					isDragging={state.type === 'dragging'}
					hasDragIndicator
					dropIndicator={forcedDropIndicator || dropIndicator}
					visualContentRef={dropTargetRef}
				>
					Flyout menu item
				</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent>
					<ReorderMenu />
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
			{dragPreview}
		</>
	);
}

function isInnerMostGroup({ location, self }: ElementDropTargetEventBasePayload): boolean {
	const [innerMost] = location.current.dropTargets.filter(
		(dropTarget) => dropTarget.data.type === 'menu-item-group',
	);
	return innerMost?.element === self.element;
}

function OurExpandableContent() {
	const [isInnerMostOver, setIsInnerMostOver] = useState<boolean>(false);

	const ref = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const element = ref.current;
		invariant(element);
		return dropTargetForElements({
			element,
			getData: () => ({ type: 'menu-item-group' }),
			onDragStart: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDropTargetChange: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDrop: () => setIsInnerMostOver(false),
		});
	}, []);

	return (
		<GroupDropIndicator isActive={isInnerMostOver} ref={ref}>
			<OurButtonMenuItem />
			<OurLinkMenuItem />
		</GroupDropIndicator>
	);
}

function OurExpandableMenuItem({
	triggerTestId,
	forcedDropIndicator,
}: {
	triggerTestId?: string;
	forcedDropIndicator?: ReactNode;
}) {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const wasExpandedWhenDragStartedRef = useRef<boolean | null>(null);
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => ({ type: 'menu-item' }),
				getDragPreviewPieces: () => ({
					elemBefore: <FilterIcon label="" />,
					content: 'Expandable menu item',
				}),
			},
			dropTarget: {
				getData: () => ({ type: 'menu-item' }),
				getOperations: () => ({
					'reorder-before': 'available',
					combine: 'available',
					'reorder-after': 'available',
				}),
				canDrop: ({ source }) => source.data.type === 'menu-item',
			},
		});

	// Close if dragging when expanded
	useEffect(() => {
		if (state.type === 'dragging') {
			setIsExpanded((current) => {
				// capture current state
				wasExpandedWhenDragStartedRef.current = current;
				// close when drag is starting
				return false;
			});
		}

		if (state.type === 'idle' && typeof wasExpandedWhenDragStartedRef.current === 'boolean') {
			setIsExpanded(wasExpandedWhenDragStartedRef.current);
			wasExpandedWhenDragStartedRef.current = null;
		}
	}, [state.type]);

	// Expand if dragged over
	useEffect(() => {
		if (isExpanded) {
			return;
		}

		if (state.type !== 'is-over') {
			return;
		}

		let timerId: number | null = window.setTimeout(() => {
			timerId = null;
			setIsExpanded(true);
		}, 500);
		return () => {
			if (timerId != null) {
				clearTimeout(timerId);
				timerId = null;
			}
		};
	}, [state.type, isExpanded]);

	return (
		<>
			<ExpandableMenuItem
				isExpanded={isExpanded}
				onExpansionToggle={() => setIsExpanded((value) => !value)}
				isDefaultExpanded={false}
			>
				<ExpandableMenuItemTrigger
					testId={triggerTestId}
					dropIndicator={dropIndicator}
					ref={draggableButtonRef}
					visualContentRef={dropTargetRef}
					isDragging={state.type === 'dragging'}
					hasDragIndicator
					elemBefore={<FilterIcon label="" />}
					actionsOnHover={
						<>
							<IconButton
								label="Add"
								icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
								appearance="subtle"
								spacing="compact"
							/>
							<FakeMoreMenu />
						</>
					}
				>
					Expandable menu item
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<OurExpandableContent />
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>
			{dragPreview}
		</>
	);
}

export function AllMenuItems() {
	// const dropIndicator = <DropIndicator instruction={{ type: 'combine', axis: 'vertical', blocked: false }} />;
	const [isInnerMostOver, setIsInnerMostOver] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		invariant(element);
		return dropTargetForElements({
			element,
			canDrop: ({ source }) => source.data.type === 'menu-item',
			getData: () => ({ type: 'menu-item-group' }),
			onDragStart: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDropTargetChange: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDrop: () => setIsInnerMostOver(false),
		});
	}, []);

	return (
		<SidebarExampleContainer>
			<SideNavContent>
				<GroupDropIndicator isActive={isInnerMostOver} ref={ref}>
					<MenuList>
						<OurLinkMenuItem testId="link-menu-item" />
						<OurButtonMenuItem testId="button-menu-item" />
						<OurFlyoutMenuItem triggerTestId="flyout-menu-item-trigger" />
						<OurExpandableMenuItem triggerTestId="expandable-menu-item-trigger" />
					</MenuList>
				</GroupDropIndicator>
			</SideNavContent>
		</SidebarExampleContainer>
	);
}

// 👇 For VR tests

function LinkMenuItemWithDropIndicator({ dropIndicator }: { dropIndicator: ReactNode }) {
	return (
		<SidebarExampleContainer>
			<SideNavContent>
				<GroupDropIndicator isActive>
					<MenuList>
						<OurLinkMenuItem testId="link-menu-item" forcedDropIndicator={dropIndicator} />
					</MenuList>
				</GroupDropIndicator>
			</SideNavContent>
		</SidebarExampleContainer>
	);
}

function ButtonMenuItemWithDropIndicator({ dropIndicator }: { dropIndicator: ReactNode }) {
	return (
		<SidebarExampleContainer>
			<SideNavContent>
				<GroupDropIndicator isActive>
					<MenuList>
						<OurButtonMenuItem testId="button-menu-item" forcedDropIndicator={dropIndicator} />
					</MenuList>
				</GroupDropIndicator>
			</SideNavContent>
		</SidebarExampleContainer>
	);
}

function FlyoutMenuItemWithDropIndicator({ dropIndicator }: { dropIndicator: ReactNode }) {
	return (
		<SidebarExampleContainer>
			<SideNavContent>
				<GroupDropIndicator isActive>
					<MenuList>
						<OurFlyoutMenuItem
							triggerTestId="flyout-menu-item-trigger"
							forcedDropIndicator={dropIndicator}
						/>
					</MenuList>
				</GroupDropIndicator>
			</SideNavContent>
		</SidebarExampleContainer>
	);
}

function ExpandableMenuItemWithDropIndicator({ dropIndicator }: { dropIndicator: ReactNode }) {
	return (
		<SidebarExampleContainer>
			<SideNavContent>
				<GroupDropIndicator isActive>
					<MenuList>
						<OurExpandableMenuItem
							triggerTestId="expandable-menu-item-trigger"
							forcedDropIndicator={dropIndicator}
						/>
					</MenuList>
				</GroupDropIndicator>
			</SideNavContent>
		</SidebarExampleContainer>
	);
}

export function LinkMenuItemReorderBefore() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function LinkMenuItemReorderAfter() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-after', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function LinkMenuItemCombine() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator instruction={{ operation: 'combine', axis: 'vertical', blocked: false }} />
			}
		/>
	);
}

export function ButtonMenuItemReorderBefore() {
	return (
		<ButtonMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function ButtonMenuItemReorderAfter() {
	return (
		<ButtonMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-after', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function ButtonMenuItemCombine() {
	return (
		<ButtonMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator instruction={{ operation: 'combine', axis: 'vertical', blocked: false }} />
			}
		/>
	);
}

export function FlyoutMenuItemReorderBefore() {
	return (
		<FlyoutMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function FlyoutMenuItemReorderAfter() {
	return (
		<FlyoutMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-after', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function FlyoutMenuItemCombine() {
	return (
		<FlyoutMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator instruction={{ operation: 'combine', axis: 'vertical', blocked: false }} />
			}
		/>
	);
}

export function ExpandableMenuItemReorderBefore() {
	return (
		<ExpandableMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function ExpandableMenuItemReorderAfter() {
	return (
		<ExpandableMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-after', axis: 'vertical', blocked: false }}
				/>
			}
		/>
	);
}

export function ExpandableMenuItemCombine() {
	return (
		<ExpandableMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator instruction={{ operation: 'combine', axis: 'vertical', blocked: false }} />
			}
		/>
	);
}

// Blocked operations
export function LinkMenuItemReorderBeforeBlocked() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-before', axis: 'vertical', blocked: true }}
				/>
			}
		/>
	);
}

export function LinkMenuItemReorderAFterBlocked() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator
					instruction={{ operation: 'reorder-after', axis: 'vertical', blocked: true }}
				/>
			}
		/>
	);
}

export function LinkMenuItemCombineBlocked() {
	return (
		<LinkMenuItemWithDropIndicator
			dropIndicator={
				<DropIndicator instruction={{ operation: 'combine', axis: 'vertical', blocked: true }} />
			}
		/>
	);
}

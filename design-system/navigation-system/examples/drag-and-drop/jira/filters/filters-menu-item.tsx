/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	Fragment,
	type Ref,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AddIcon from '@atlaskit/icon/core/add';
import FilterIcon from '@atlaskit/icon/core/filter';
import GrowVerticalIcon from '@atlaskit/icon/core/grow-vertical';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { GroupDropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';
import { useMenuItemDragAndDrop } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import {
	dropTargetForElements,
	type ElementDropTargetEventBasePayload,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import {
	getFilterData,
	getTopLevelItemData,
	isFilterData,
	isTopLevelItemData,
	type TFilter,
} from '../data';
import { RegistryContext } from '../registry';
import { useGetData, useLastAction } from '../state-context';
import { TopLevelSharedMoreMenu } from '../top-level-shared-more-menu';

import { FilterMoveModal } from './filter-move-modal';
import { getPathToFilter } from './filter-tree-utils';

export function FiltersMenuItem({
	filters,
	index,
	amountOfMenuItems,
}: {
	filters: TFilter[];
	index: number;
	amountOfMenuItems: number;
}) {
	const [isExpanded, setIsExpanded] = useState<boolean>(true);
	const wasExpandedWhenDragStartedRef = useRef<boolean | null>(null);
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getTopLevelItemData('filters'),
				getDragPreviewPieces: () => ({
					elemBefore: <FilterIcon label="" />,
					content: 'Filters',
				}),
			},
			dropTarget: {
				getData: () => getTopLevelItemData('filters'),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isTopLevelItemData(source.data),
			},
		});

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

	// register element
	const registry = useContext(RegistryContext);
	useEffect(() => {
		const element = draggableButtonRef.current;
		invariant(element);
		registry?.registerTopLevelItem({ item: 'filters', element });
	}, [registry, draggableButtonRef]);

	return (
		<>
			<ExpandableMenuItem
				isExpanded={isExpanded}
				onExpansionToggle={() => setIsExpanded((value) => !value)}
				dropIndicator={dropIndicator}
				ref={dropTargetRef}
			>
				<ExpandableMenuItemTrigger
					ref={draggableButtonRef}
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
							<TopLevelSharedMoreMenu
								index={index}
								amountOfMenuItems={amountOfMenuItems}
								value="filters"
							/>
						</>
					}
				>
					Filters
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<FilterList filters={filters} />
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>
			{dragPreview}
		</>
	);
}

function FilterLeaf({ filter }: { filter: TFilter }) {
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getFilterData(filter),
				getDragPreviewPieces: () => ({
					elemBefore: filter.icon,
					content: filter.name,
				}),
			},
			dropTarget: {
				getData: () => getFilterData(filter),
				getOperations: () => ({
					combine: 'available',
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isFilterData(source.data),
			},
		});

	const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const registry = useContext(RegistryContext);
	useEffect(() => {
		const element = draggableAnchorRef.current;
		invariant(element);
		registry?.registerFilter({ filterId: filter.id, element });
	}, [registry, draggableAnchorRef, filter.id]);

	return (
		<>
			<LinkMenuItem
				href={filter.href}
				elemBefore={filter.icon}
				ref={draggableAnchorRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
				actionsOnHover={
					<DropdownMenu
						shouldRenderToParent
						isOpen={isMenuOpen}
						onOpenChange={() => setIsMenuOpen((current) => !current)}
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
						</DropdownItemGroup>
						<DropdownItemGroup hasSeparator>
							<DropdownItem
								elemBefore={<GrowVerticalIcon label="" />}
								onClick={() => {
									setIsMenuOpen(false);
									setIsMoveModalOpen(true);
								}}
							>
								Move filter
							</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
				}
			>
				{filter.name}
			</LinkMenuItem>
			<ModalTransition>
				{isMoveModalOpen && (
					<FilterMoveModal onClose={() => setIsMoveModalOpen(false)} filter={filter} />
				)}
			</ModalTransition>
			<ModalTransition>
				{isMoveModalOpen && (
					<FilterMoveModal onClose={() => setIsMoveModalOpen(false)} filter={filter} />
				)}
			</ModalTransition>
			{dragPreview}
		</>
	);
}

// TODO: clear in onGenerateDragPreview()?
const expandedAtDragStart = new Set<string>();

function FilterParent({ filter }: { filter: TFilter }) {
	const lastAction = useLastAction();
	const getData = useGetData();

	const shouldExpand = useCallback(() => {
		if (expandedAtDragStart.has(filter.id)) {
			return true;
		}

		if (lastAction?.type !== 'filter-move') {
			return false;
		}

		// A filter was moved - need to check if we should open

		// 1. Open if any child the target of an any operation
		// (ideally this call would be memoized)
		const pathToDraggingItem = getPathToFilter(getData().filters, lastAction.draggingId);
		if (pathToDraggingItem?.includes(filter.id)) {
			return true;
		}

		// 2. Was this Filter the target of a combine?
		return lastAction.operation === 'combine' && lastAction.targetId === filter.id;
	}, [lastAction, filter.id, getData]);

	const [isExpanded, setIsExpanded] = useState<boolean>(() => shouldExpand());
	const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getFilterData(filter),
				getDragPreviewPieces: () => ({
					elemBefore: filter.icon,
					content: filter.name,
				}),
			},
			dropTarget: {
				getData: () => getFilterData(filter),
				getOperations: () => ({
					combine: 'available',
					'reorder-before': 'available',
					'reorder-after': isExpanded ? 'not-available' : 'available',
				}),
				canDrop: ({ source }) => isFilterData(source.data),
			},
		});

	const [isDraggingAFilter, setIsDraggingAFilter] = useState<boolean>(false);

	// If any filter is dragging, use a cheveron to add clarity
	useEffect(() => {
		return monitorForElements({
			canMonitor: ({ source }) => isFilterData(source.data),
			onGenerateDragPreview() {
				// just being safe and clearing before any drag is starting
				expandedAtDragStart.clear();
			},
			onDragStart() {
				setIsDraggingAFilter(true);
			},
			onDrop() {
				setIsDraggingAFilter(false);
			},
		});
	}, []);

	// Collapse when drag starting.
	// Restore the collapse state when the drag is finished
	useEffect(() => {
		// will be called when mounting, as well as when the drag finishes
		if (state.type === 'idle' && shouldExpand()) {
			setIsExpanded(true);
			expandedAtDragStart.delete(filter.id);
		}

		if (state.type === 'dragging') {
			setIsExpanded((current) => {
				if (current) {
					expandedAtDragStart.add(filter.id);
				}
				return false;
			});
		}
	}, [state.type, filter.id, shouldExpand]);

	// Expand if dragged over
	useEffect(() => {
		if (isExpanded) {
			return;
		}

		if (state.type !== 'is-over') {
			return;
		}

		// Only expand if combining
		if (state.instruction?.operation !== 'combine') {
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
	}, [state, isExpanded]);

	// register element
	const registry = useContext(RegistryContext);
	useEffect(() => {
		const element = draggableAnchorRef.current;
		invariant(element);
		registry?.registerFilter({ filterId: filter.id, element });
	}, [registry, draggableAnchorRef, filter.id]);

	return (
		<>
			<ExpandableMenuItem
				isExpanded={isExpanded}
				onExpansionToggle={() => setIsExpanded((value) => !value)}
			>
				<ExpandableMenuItemTrigger
					ref={draggableAnchorRef}
					href={filter.href}
					isDragging={state.type === 'dragging'}
					hasDragIndicator
					visualContentRef={dropTargetRef}
					dropIndicator={dropIndicator}
					elemBefore={isDraggingAFilter ? null : filter.icon}
					actionsOnHover={
						<DropdownMenu
							shouldRenderToParent
							isOpen={isMenuOpen}
							onOpenChange={() => setIsMenuOpen((current) => !current)}
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
							</DropdownItemGroup>
							<DropdownItemGroup hasSeparator>
								<DropdownItem
									elemBefore={<GrowVerticalIcon label="" />}
									onClick={() => {
										setIsMenuOpen(false);
										setIsMoveModalOpen(true);
									}}
								>
									Move filter
								</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					}
				>
					{filter.name}
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<FilterList filters={filter.children} />
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>
			<ModalTransition>
				{isMoveModalOpen && (
					<FilterMoveModal onClose={() => setIsMoveModalOpen(false)} filter={filter} />
				)}
			</ModalTransition>
			{dragPreview}
		</>
	);
}

function FilterList({ filters }: { filters: TFilter[] }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<'idle' | 'is-innermost-over'>('idle');

	useEffect(() => {
		const element = ref.current;
		invariant(element);

		function onChange({ location, self }: ElementDropTargetEventBasePayload) {
			const [innerMost] = location.current.dropTargets.filter(
				(dropTarget) => dropTarget.data.type === 'filter-group',
			);

			setState(innerMost?.element === self.element ? 'is-innermost-over' : 'idle');
		}

		return dropTargetForElements({
			element,
			getData: () => ({ type: 'filter-group' }),
			canDrop: ({ source }) => isFilterData(source.data),
			onDragStart: onChange,
			onDropTargetChange: onChange,
			onDrop() {
				setState('idle');
			},
		});
	}, []);

	return (
		<GroupDropIndicator isActive={state === 'is-innermost-over'} ref={ref}>
			{filters.map((filter) => (
				<Fragment key={filter.id}>
					{filter.children.length ? (
						<FilterParent filter={filter} />
					) : (
						<FilterLeaf filter={filter} />
					)}
				</Fragment>
			))}
		</GroupDropIndicator>
	);
}

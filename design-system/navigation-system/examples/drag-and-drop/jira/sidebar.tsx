/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { MenuList } from '@atlaskit/navigation-system';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { GroupDropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';
import {
	extractInstruction,
	type Instruction,
} from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/hitbox';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import {
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import {
	getInitialData,
	isFilterData,
	isProjectData,
	isTopLevelItemData,
	type TAction,
	type TData,
	type TTopLevelItem,
} from './data';
import { find } from './filters/filter-tree-utils';
import { FiltersMenuItem } from './filters/filters-menu-item';
import { ForYouMenuItem } from './for-you/for-you-menu-item';
import { ProjectsMenuItem } from './projects/projects-menu-item';
import { RecentMenuItem } from './recent/recent-menu-item';
import { reduce } from './reducer';
import { createRegistry, RegistryContext } from './registry';
import { StarredMenuItem } from './starred/starred-menu-item';
import {
	DispatchContext,
	GetDataContext,
	LastActionContext,
	type TDispatchContextValue,
	type TGetDataContextValue,
} from './state-context';

const topLevelMap: {
	[TName in TTopLevelItem]: (args: {
		data: TData;
		index: number;
		amountOfMenuItems: number;
	}) => ReactNode;
} = {
	'for-you': ({ index, amountOfMenuItems }) => (
		<ForYouMenuItem index={index} amountOfMenuItems={amountOfMenuItems} />
	),
	starred: ({ index, amountOfMenuItems }) => (
		<StarredMenuItem index={index} amountOfMenuItems={amountOfMenuItems} />
	),
	recent: ({ index, amountOfMenuItems }) => (
		<RecentMenuItem index={index} amountOfMenuItems={amountOfMenuItems} />
	),
	projects: ({ data, index, amountOfMenuItems }) => (
		<ProjectsMenuItem
			projects={data.projects}
			index={index}
			amountOfMenuItems={amountOfMenuItems}
		/>
	),
	filters: ({ data, index, amountOfMenuItems }) => (
		<FiltersMenuItem filters={data.filters} index={index} amountOfMenuItems={amountOfMenuItems} />
	),
};

function getReorderFinishIndex({
	indexOfTarget,
	instruction,
}: {
	indexOfTarget: number;
	instruction: Instruction;
}): number {
	if (instruction.operation === 'reorder-before') {
		return indexOfTarget;
	}
	if (instruction.operation === 'reorder-after') {
		return indexOfTarget + 1;
	}
	return indexOfTarget;
}

function getPosition(index: number) {
	return index + 1;
}

export function Sidebar() {
	const [data, setData] = useState(getInitialData);
	const stableData = useStableRef(data);
	const [registry] = useState(createRegistry);
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<'idle' | 'is-over'>('idle');
	const scrollableRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		return monitorForElements({
			canMonitor: ({ source }) =>
				isTopLevelItemData(source.data) || isProjectData(source.data) || isFilterData(source.data),
			onDrop({ source, location }) {
				const dragging = source.data;
				const [innerMost] = location.current.dropTargets;

				if (!innerMost) {
					return;
				}
				const dropTargetData = innerMost.data;

				const instruction: Instruction | null = extractInstruction(dropTargetData);
				if (!instruction) {
					return;
				}

				// top level item dragging onto top level item
				if (isTopLevelItemData(dragging) && isTopLevelItemData(dropTargetData)) {
					setData((current) => {
						const startIndex = current.topLevelItems.indexOf(dragging.value);

						// Need to know what the indexes would be without the dragging item
						const withoutDraggingItem = current.topLevelItems.filter(
							(item) => item !== dragging.value,
						);
						const indexOfTarget = withoutDraggingItem.indexOf(dropTargetData.value);

						const finishIndex = getReorderFinishIndex({ indexOfTarget, instruction });

						const action: TAction = {
							type: 'top-level-menu-reorder',
							value: dragging.value,
							startIndex,
							finishIndex,
							trigger: 'pointer',
						};

						return reduce(current, action);
					});
					return;
				}

				// project dragging onto project
				if (isProjectData(dragging) && isProjectData(dropTargetData)) {
					// only supporting dragging projects within the same group
					if (dragging.groupName !== dropTargetData.groupName) {
						return;
					}

					setData((current) => {
						const list = current.projects[dragging.groupName];
						const startIndex = list.findIndex((project) => project.id === dragging.id);

						// Need to know what the indexes would be without the dragging item
						const withoutDraggingProject = list.filter((project) => project.id !== dragging.id);

						const indexOfTarget = withoutDraggingProject.findIndex(
							(project) => project.id === dropTargetData.id,
						);

						const finishIndex = getReorderFinishIndex({ indexOfTarget, instruction });

						const action: TAction = {
							type: 'reorder-project',
							draggingId: dragging.id,
							groupName: dragging.groupName,
							startIndex,
							finishIndex,
							trigger: 'pointer',
						};

						return reduce(current, action);
					});
				}

				// filter dragging onto project
				if (isFilterData(dragging) && isFilterData(dropTargetData)) {
					// 1. lookup the dragging filter
					// 2. remove it from the tree
					// 3. insert it into the tree where it makes sense
					setData((current) => {
						const action: TAction = {
							type: 'filter-move',
							draggingId: dragging.id,
							targetId: dropTargetData.id,
							operation: instruction.operation,
							trigger: 'pointer',
						};

						return reduce(current, action);
					});
				}
			},
		});
	}, []);

	// setup auto scrolling for sidenav scroll container
	useEffect(() => {
		const scrollable = scrollableRef.current;
		invariant(scrollable);
		return autoScrollForElements({
			element: scrollable,
			canScroll: ({ source }) =>
				isProjectData(source.data) || isFilterData(source.data) || isTopLevelItemData(source.data),
		});
	}, []);

	useEffect(() => {
		const action = data.lastAction;
		if (!action) {
			return;
		}
		if (action.type === 'top-level-menu-reorder') {
			const element = registry.getElementForTopLevelItem(action.value);
			if (!element) {
				return;
			}
			triggerPostMoveFlash(element);

			if (action.trigger === 'keyboard') {
				// .focus() seems to be more reliable in the next task when used with VoiceOver
				setTimeout(() => element.focus());
			}

			// TODO: screen reader announce
			liveRegion.announce(
				`The top level menu item ${action.value} has moved from position ${getPosition(action.startIndex)} to ${getPosition(action.finishIndex)}`,
			);

			return;
		}

		if (action.type === 'reorder-project') {
			const element = registry.getElementForProject(action.draggingId);
			if (!element) {
				return;
			}
			triggerPostMoveFlash(element);

			if (action.trigger === 'keyboard') {
				// .focus() seems to be more reliable in the next task when used with VoiceOver
				setTimeout(() => element.focus());
			}

			const project = stableData.current.projects[action.groupName].find(
				(project) => project.id === action.draggingId,
			);
			invariant(project);

			liveRegion.announce(
				`The project ${project.name} has moved from position ${getPosition(action.startIndex)} to ${getPosition(action.finishIndex)}`,
			);

			return;
		}

		// TODO: after a move, should also expand all required tree items
		// to make the moved item visible
		if (action.type === 'filter-move') {
			const element = registry.getElementForFilter(action.draggingId);
			if (!element) {
				return;
			}
			triggerPostMoveFlash(element);

			if (action.trigger === 'keyboard') {
				// .focus() seems to be more reliable in the next task when used with VoiceOver
				setTimeout(() => element.focus());
			}

			const message: string = (() => {
				const filter = find(stableData.current.filters, action.draggingId);
				const target = find(stableData.current.filters, action.targetId);
				invariant(filter && target, 'unable to find elements');
				if (action.operation === 'combine') {
					return `The filter ${filter.name} is now a child of ${target.name}`;
				}

				if (action.operation === 'reorder-after') {
					return `The filter ${filter.name} is now positioned after ${target.name}`;
				}

				return `The filter ${filter.name} is now positioned before ${target.name}`;
			})();

			liveRegion.announce(message);

			return;
		}
	}, [registry, stableData, data.lastAction]);

	// Cleanup our live region when unmounted
	useEffect(() => {
		return () => liveRegion.cleanup();
	}, []);

	useEffect(() => {
		const element = ref.current;
		invariant(element);
		return dropTargetForElements({
			element,
			canDrop: ({ source }) => isTopLevelItemData(source.data),
			onDragStart() {
				setState('is-over');
			},
			onDragEnter() {
				setState('is-over');
			},
			onDragLeave() {
				setState('idle');
			},
			onDrop() {
				setState('idle');
			},
		});
	}, []);

	const dispatch: TDispatchContextValue = useCallback(function dispatch(action: TAction) {
		setData((current) => reduce(current, action));
	}, []);

	const getData: TGetDataContextValue = useCallback(
		function getData() {
			return stableData.current;
		},
		[stableData],
	);

	return (
		<SideNavContent ref={scrollableRef}>
			<GetDataContext.Provider value={getData}>
				<DispatchContext.Provider value={dispatch}>
					<LastActionContext.Provider value={data.lastAction}>
						<RegistryContext.Provider value={registry}>
							<MenuList>
								<GroupDropIndicator ref={ref} isActive={state === 'is-over'}>
									{data.topLevelItems.map((item, index, array) => {
										return (
											<Fragment key={item}>
												{topLevelMap[item]({ data, index, amountOfMenuItems: array.length })}
											</Fragment>
										);
									})}
								</GroupDropIndicator>
							</MenuList>
						</RegistryContext.Provider>
					</LastActionContext.Provider>
				</DispatchContext.Provider>
			</GetDataContext.Provider>
		</SideNavContent>
	);
}

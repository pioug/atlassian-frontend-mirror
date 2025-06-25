/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type Ref, useContext, useEffect, useRef, useState } from 'react';

import { css } from '@compiled/react';
import invariant from 'tiny-invariant';

import { IconButton } from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import TagIcon from '@atlaskit/icon/core/tag';
import { GroupDropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';
import { useMenuItemDragAndDrop } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { getProjectData, isProjectData, type TProject } from '../data';
import { RegistryContext } from '../registry';
import { ReorderActionMenu } from '../reorder-actions';
import { useDispatch } from '../state-context';

const capitalize = css({ textTransform: 'capitalize' });

export function ProjectGroup({
	name,
	projects,
}: {
	name: 'starred' | 'recent';
	projects: TProject[];
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<'idle' | 'is-over'>();

	useEffect(() => {
		const element = ref.current;

		// might have no projects
		if (!element) {
			return;
		}

		return dropTargetForElements({
			element,
			canDrop: ({ source }) => {
				const data = source.data;
				if (!isProjectData(data)) {
					return false;
				}
				// only allowing projects to be dropped in the same group
				return Boolean(projects.find((project) => project.id === data.id));
			},
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
	});

	if (!projects.length) {
		return null;
	}

	return (
		<GroupDropIndicator isActive={state === 'is-over'} ref={ref} testId={`project-group-${name}`}>
			<MenuSection isMenuListItem>
				<MenuSectionHeading>
					<span css={capitalize}>{name}</span>
				</MenuSectionHeading>
				<MenuList>
					{projects.map((project, index) => (
						<Project
							project={project}
							key={project.id}
							group={projects}
							groupName={name}
							indexInGroup={index}
						/>
					))}
				</MenuList>
			</MenuSection>
		</GroupDropIndicator>
	);
}

function MoreMenu({
	project,
	amountInGroup,
	groupName,
	indexInGroup,
}: {
	project: TProject;
	indexInGroup: number;
	amountInGroup: number;
	groupName: 'starred' | 'recent';
}) {
	const dispatch = useDispatch();
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
				<DropdownItem elemBefore={<SettingsIcon label="" />}>Board settings</DropdownItem>
				<DropdownItem elemBefore={<TagIcon label="" />}>Add label</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<ReorderActionMenu
					label="Reorder project"
					index={indexInGroup}
					listSize={amountInGroup}
					onMoveToTop={() => {
						dispatch({
							type: 'reorder-project',
							trigger: 'keyboard',
							draggingId: project.id,
							groupName,
							startIndex: indexInGroup,
							finishIndex: 0,
						});
						setIsOpen(false);
					}}
					onMoveUp={() => {
						dispatch({
							type: 'reorder-project',
							trigger: 'keyboard',
							draggingId: project.id,
							groupName,
							startIndex: indexInGroup,
							finishIndex: indexInGroup - 1,
						});
						setIsOpen(false);
					}}
					onMoveDown={() => {
						dispatch({
							type: 'reorder-project',
							trigger: 'keyboard',
							draggingId: project.id,
							groupName,
							startIndex: indexInGroup,
							finishIndex: indexInGroup + 1,
						});
						setIsOpen(false);
					}}
					onMoveToBottom={() => {
						dispatch({
							type: 'reorder-project',
							trigger: 'keyboard',
							draggingId: project.id,
							groupName,
							startIndex: indexInGroup,
							finishIndex: amountInGroup - 1,
						});
						setIsOpen(false);
					}}
				/>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}
function Project({
	project,
	group,
	groupName,
	indexInGroup,
}: {
	project: TProject;
	group: TProject[];
	groupName: 'recent' | 'starred';
	indexInGroup: number;
}) {
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getProjectData({ project, groupName }),
				getDragPreviewPieces: () => ({
					elemBefore: project.icon,
					content: project.name,
				}),
			},
			dropTarget: {
				getData: () => getProjectData({ project, groupName }),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => {
					const data = source.data;
					// Only allowing projects to be dropped in the same group
					return isProjectData(data) && data.groupName === groupName;
				},
			},
		});

	// register element
	const registry = useContext(RegistryContext);
	useEffect(() => {
		const element = draggableAnchorRef.current;
		invariant(element);
		registry?.registerProject({ projectId: project.id, element });
	}, [registry, draggableAnchorRef, project.id]);

	return (
		<>
			<LinkMenuItem
				href={project.href}
				elemBefore={project.icon}
				ref={draggableAnchorRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
				actionsOnHover={
					<MoreMenu
						project={project}
						groupName={groupName}
						indexInGroup={indexInGroup}
						amountInGroup={group.length}
					/>
				}
			>
				{project.name}
			</LinkMenuItem>
			{dragPreview}
		</>
	);
}

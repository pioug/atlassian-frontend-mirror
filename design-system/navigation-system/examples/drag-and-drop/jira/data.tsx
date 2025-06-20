import React, { type ReactNode } from 'react';

import BasketballIcon from '@atlaskit/icon/core/basketball';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import DeviceMobileIcon from '@atlaskit/icon/core/device-mobile';
import FilterIcon from '@atlaskit/icon/core/filter';
import ImageIcon from '@atlaskit/icon/core/image';
import ScorecardIcon from '@atlaskit/icon/core/scorecard';
import TextIcon from '@atlaskit/icon/core/text';
import ThemeIcon from '@atlaskit/icon/core/theme';
import VehicleCarIcon from '@atlaskit/icon/core/vehicle-car';
import type { Operation } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/hitbox';
import { token } from '@atlaskit/tokens';

import { ProjectTile } from './projects/project-tile';

export type TFilter = {
	id: string;
	icon: ReactNode;
	name: string;
	href: string;
	children: TFilter[];
};

const filterKey = Symbol('filter');

export type TFilterData = {
	[filterKey]: true;
	id: string;
};

export function getFilterData(filter: TFilter): TFilterData {
	return {
		id: filter.id,
		[filterKey]: true,
	};
}

export function isFilterData(data: Record<string | symbol, unknown>): data is TFilterData {
	return data[filterKey] === true;
}

export type TProject = {
	id: string;
	href: string;
	icon: ReactNode;
	name: string;
};

const projectKey = Symbol('project');

export type TProjectData = {
	[projectKey]: true;
	groupName: 'recent' | 'starred';
	id: string;
};

export function getProjectData({
	project,
	groupName,
}: {
	project: TProject;
	groupName: 'recent' | 'starred';
}): TProjectData {
	return {
		id: project.id,
		groupName,
		[projectKey]: true,
	};
}

export function isProjectData(data: Record<string | symbol, unknown>): data is TProjectData {
	return data[projectKey] === true;
}

const topLevelItems = ['for-you', 'recent', 'starred', 'projects', 'filters'] as const;

export type TTopLevelItem = (typeof topLevelItems)[number];

export type TActionTrigger = 'pointer' | 'keyboard';

export type TAction =
	| {
			type: 'top-level-menu-reorder';
			trigger: TActionTrigger;
			value: TTopLevelItem;
			startIndex: number;
			finishIndex: number;
	  }
	| {
			type: 'reorder-project';
			trigger: TActionTrigger;
			groupName: 'starred' | 'recent';
			draggingId: string;
			startIndex: number;
			finishIndex: number;
	  }
	| {
			type: 'filter-move';
			trigger: TActionTrigger;
			draggingId: string;
			targetId: string;
			operation: Operation;
	  };

export type TData = {
	topLevelItems: TTopLevelItem[];
	projects: { starred: TProject[]; recent: TProject[] };
	filters: TFilter[];
	lastAction: TAction | null;
};

const getId = (() => {
	let count: number = 0;
	return function getId(): string {
		return `id:${count++}`;
	};
})();

export function getInitialData(): TData {
	return {
		lastAction: null,
		topLevelItems: Array.from(topLevelItems),
		projects: {
			starred: [
				{
					id: getId(),
					href: '#',
					name: 'Modernize typography',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.purple.bolder')}>
							<TextIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'F1 sponsorship',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.yellow.bolder')}>
							<VehicleCarIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'Mobile application',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.green.bolder')}>
							<DeviceMobileIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
			],
			recent: [
				{
					id: getId(),
					href: '#',
					name: 'Attachments',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.lime.bolder')}>
							<ImageIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'Audit',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.magenta.bolder')}>
							<ScorecardIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'Dark mode',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.gray.bolder')}>
							<ThemeIcon label="" color="currentColor" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'Visualization',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.blue.bolder')}>
							<ChartBarIcon label="" />
						</ProjectTile>
					),
				},
				{
					id: getId(),
					href: '#',
					name: 'Basketball tournament',
					icon: (
						<ProjectTile backgroundColor={token('color.background.accent.orange.bolder')}>
							<BasketballIcon label="" />
						</ProjectTile>
					),
				},
			],
		},
		filters: [
			{
				id: getId(),
				name: 'Filter 1',
				href: '#',
				icon: <FilterIcon label="" />,
				children: [
					{
						id: getId(),
						name: 'Filter 1.1',
						href: '#',
						icon: <FilterIcon label="" />,
						children: [],
					},
					{
						id: getId(),
						name: 'Filter 1.2',
						href: '#',
						icon: <FilterIcon label="" />,
						children: [],
					},
					{
						id: getId(),
						name: 'Filter 1.3',
						href: '#',
						icon: <FilterIcon label="" />,
						children: [],
					},
				],
			},
			{
				id: getId(),
				name: 'Filter 2',
				href: '#',
				icon: <FilterIcon label="" />,
				children: [
					{
						id: getId(),
						name: 'Filter 2.1',
						href: '#',
						icon: <FilterIcon label="" />,
						children: [
							{
								id: getId(),
								name: 'Filter 2.1.1',
								href: '#',
								icon: <FilterIcon label="" />,
								children: [],
							},
							{
								id: getId(),
								name: 'Filter 2.1.2',
								href: '#',
								icon: <FilterIcon label="" />,
								children: [],
							},
							{
								id: getId(),
								name: 'Filter 2.1.3',
								href: '#',
								icon: <FilterIcon label="" />,
								children: [],
							},
						],
					},
					{
						id: getId(),
						name: 'Filter 2.2',
						href: '#',
						icon: <FilterIcon label="" />,
						children: [],
					},
				],
			},
			{
				id: getId(),
				name: 'Filter 3',
				href: '#',
				icon: <FilterIcon label="" />,
				children: [],
			},
			{
				id: getId(),
				name: 'Filter 4',
				href: '#',
				icon: <FilterIcon label="" />,
				children: [],
			},
		],
	};
}

const topLevelItemKey = Symbol('top-level');

type TTopLevelItemData = {
	value: TTopLevelItem;
	[topLevelItemKey]: true;
};

export function getTopLevelItemData(value: TTopLevelItem): TTopLevelItemData {
	return {
		value,
		[topLevelItemKey]: true,
	};
}

export function isTopLevelItemData(
	data: Record<string | symbol, unknown>,
): data is TTopLevelItemData {
	return data[topLevelItemKey] === true;
}

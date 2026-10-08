/**
 * Constants for the board-themed example
 */

import avatar1Url from '../assets/avatars/avatar-1.jpg';
import avatar2Url from '../assets/avatars/avatar-2.jpg';
import avatar3Url from '../assets/avatars/avatar-3.jpg';
import boldSkyUrl from '../assets/bold-sky.jpg';
import complexBackgroundUrl from '../assets/complex-background.jpg';
import darkCityUrl from '../assets/dark-city.jpg';
import darkPlantsUrl from '../assets/dark-plants.jpg';
import darkSkyUrl from '../assets/dark-sky.jpg';
import commbankLogoMonochromeUrl from '../assets/logos/commbank-monochrome.png';
import commbankLogoUrl from '../assets/logos/commbank.png';
import vitafleetLogoUrl from '../assets/logos/vitafleet.png';
import type { BoardColumnData, BoardTemplate, NavTemplate, NavThemingMode } from './types';

export const AVATAR_DATA: { name: string; src: string }[] = [
	{ name: 'Sarah Chen', src: avatar1Url },
	{ name: 'Marcus Johnson', src: avatar2Url },
	{ name: 'Emma Wilson', src: avatar3Url },
	{ name: 'Chloe Lee', src: avatar1Url },
	{ name: 'Florence García', src: avatar2Url },
	{ name: 'Andrew Park', src: avatar3Url },
	{ name: 'David Kim', src: avatar1Url },
	{ name: 'Sophie Martinez', src: avatar2Url },
	{ name: 'James Taylor', src: avatar3Url },
];

export const DEFAULT_BOARD_COLUMNS: BoardColumnData[] = [
	{
		title: 'To do',
		color: '#357DE8',
		count: 2,
		cards: [
			{
				id: '1',
				title: "Follow Annie's Goal Reach 50k customers",
				imageUrl: darkSkyUrl,
				label: { text: 'Goals', color: 'blue' },
				tags: ['teamwork', 'collection', 'customers', '50k', '60k'],
				assignee: 'Annie',
				issueKey: 'NUC-361',
				storyPoints: 6,
				dueDate: '24 Oct 24',
			},
			{
				id: '2',
				title: "Watch Michael's Loom introducing new ways of working",
				imageUrl: complexBackgroundUrl,
				label: { text: 'Teamwork', color: 'success' },
				tags: ['Project', 'collection', 'sync', 'campaign', 'Loom'],
				assignee: 'Michael',
				issueKey: 'NUC-362',
				storyPoints: 1,
			},
		],
	},
	{
		title: 'In progress',
		color: '#FCA700',
		count: 1,
		cards: [
			{
				id: '3',
				title: 'Multi-dest search UI mobileweb',
				imageUrl: darkSkyUrl,
				label: { text: 'Search', color: 'purple' },
				tags: ['mobile', 'search', 'sync', 'campaign'],
				assignee: 'Dev',
				issueKey: 'NUC-363',
				storyPoints: 10,
				dueDate: '24 Oct 24',
			},
			{
				id: '4',
				title: 'Color of pale yellow on our pages looks incorrect',
				label: { text: 'Colour', color: 'yellow' },
				tags: ['mobile', 'search', 'sync', 'campaign'],
				assignee: 'Designer',
				issueKey: 'NUC-363',
				storyPoints: 1,
			},
		],
	},
	{
		title: 'In review',
		color: '#AF59E1',
		count: 1,
		cards: [
			{
				id: '5',
				title: "Watch Michael's Loom introducing new ways of working",
				imageUrl: complexBackgroundUrl,
				label: { text: 'Loom', color: 'teal' },
				tags: ['ASOW'],
				assignee: 'Michael',
				issueKey: 'NUC-364',
				storyPoints: 2,
				dueDate: '24 Oct 24',
			},
		],
	},
	{
		title: 'Done',
		color: '#6A9A23',
		count: 1,
		cards: [
			{
				id: '6',
				title: 'Multi-dest search UI mobileweb',
				imageUrl: darkSkyUrl,
				label: { text: 'Mobile', color: 'teal' },
				tags: ['ASOW', 'teamwork', 'collection', 'customers'],
				assignee: 'Dev',
				issueKey: 'NUC-365',
				storyPoints: 2,
			},
			{
				id: '7',
				title: "Watch Michael's Loom introducing new ways of working",
				imageUrl: complexBackgroundUrl,
				label: { text: 'Working', color: 'blue' },
				tags: ['Project', 'collection', 'sync', 'campaign', 'Loom'],
				assignee: 'Michael',
				issueKey: 'NUC-380',
				storyPoints: 1,
			},
		],
	},
];

export { darkSkyUrl, complexBackgroundUrl, boldSkyUrl, darkCityUrl };

export const NAV_TEMPLATES: NavTemplate[] = [
	{
		id: 'nav-template-1',
		name: 'Red',
		theme: {
			backgroundColor: '#C03E35',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'nav-template-2',
		name: 'Blue',
		theme: {
			backgroundColor: '#1E3A5F',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'nav-template-3',
		name: 'Gray',
		theme: {
			backgroundColor: '#4A5568',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'nav-template-4',
		name: 'Green',
		theme: {
			backgroundColor: '#326950',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'nav-template-5',
		name: 'Subtle purple',
		theme: {
			backgroundColor: '#d9bdea',
			foregroundColor: '#17212b',
		},
	},
	{
		id: 'nav-template-6',
		name: 'Subtle green',
		theme: {
			backgroundColor: '#b8e6ce',
			foregroundColor: '#17212b',
		},
	},
];

export const BOARD_TEMPLATES: BoardTemplate[] = [
	{
		id: 'board-template-1',
		name: 'Dark Sky',
		imageUrl: darkSkyUrl,
		theme: {
			backgroundColor: '#293947',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'board-template-2',
		name: 'Complex City',
		imageUrl: complexBackgroundUrl,
		theme: {
			backgroundColor: '#446477',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'board-template-3',
		name: 'Bold Sky',
		imageUrl: boldSkyUrl,
		theme: {
			backgroundColor: '#307090',
			foregroundColor: '#ffffff',
		},
	},
	{
		id: 'board-template-4',
		name: 'Dark Plants',
		imageUrl: darkPlantsUrl,
		theme: {
			backgroundColor: '#1c3730',
			foregroundColor: '#ffffff',
		},
	},
];

export type LogoTemplate = {
	id: string;
	name: string;
	logoUrl: string | undefined;
	brandColor: `#${string}`;
	navThemingMode: NavThemingMode;
	logoMonochrome?: boolean;
};

// Generate combined templates: each logo with each NAV_TEMPLATE color
export const LOGO_TEMPLATES: LogoTemplate[] = [
	{
		id: 'Atlassian',
		name: 'Atlassian',
		logoUrl: undefined,
		brandColor: '#ffffff',
		navThemingMode: 'none',
	},
	{
		id: 'logo-vitafleet-subtle',
		name: 'Vitafleet - Subtle',
		logoUrl: vitafleetLogoUrl,
		brandColor: '#C03E35',
		navThemingMode: 'subtle',
	},
	{
		id: 'logo-vitafleet-bold',
		name: 'Vitafleet - Bold',
		logoUrl: vitafleetLogoUrl,
		brandColor: '#C03E35',
		navThemingMode: 'bold',
		logoMonochrome: true,
	},
	{
		id: 'logo-commbank-bold',
		name: 'CommBank - Bold',
		logoUrl: commbankLogoMonochromeUrl,
		brandColor: '#FECA0A',
		navThemingMode: 'bold',
		logoMonochrome: true,
	},
	{
		id: 'logo-commbank-subtle',
		name: 'CommBank - Subtle',
		logoUrl: commbankLogoUrl,
		brandColor: '#FECA0A',
		navThemingMode: 'subtle',
	},
	{
		id: 'logo-commbank-subtlest',
		name: 'CommBank - Subtle',
		logoUrl: commbankLogoUrl,
		brandColor: '#000000',
		navThemingMode: 'subtle',
	},
	{
		id: 'blue',
		name: 'Vitafleet - Blue',
		logoUrl: undefined,
		brandColor: '#1E3A5F',
		navThemingMode: 'subtle',
	},

	{
		id: 'green',
		name: 'Vitafleet - Green',
		logoUrl: undefined,
		brandColor: '#326950',
		navThemingMode: 'subtle',
	},
	{
		id: 'subtle-purple',
		name: 'CommBank - Subtle purple',
		logoUrl: undefined,
		brandColor: '#c89ee2',
		navThemingMode: 'bold',
	},
	{
		id: 'subtle-green',
		name: 'Vitafleet - Subtle green',
		logoUrl: undefined,
		brandColor: '#b8e6ce',
		navThemingMode: 'bold',
	},
];

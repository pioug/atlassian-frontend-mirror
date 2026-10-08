/**
 * Shared types for the board-themed example
 */

export type ThemeConfig = {
	foregroundColor: string;
	backgroundColor: string;
	autoForegroundColor?: boolean;
	logoUrl?: string;
	logoMonochrome?: boolean;
};

export type NavThemingMode = 'none' | 'subtlest' | 'subtle' | 'bold';

export type TintingConfig = {
	enabled: boolean;
	brandColor: `#${string}`;
	autoBrandColor?: boolean;
};

export type AdvancedParameters = {
	autoForegroundColor: boolean;
	subtleLightness: number; // HCT tone value for subtle mode background (80-100)
	tintNeutrals?: boolean;
	tintSurface?: boolean;
	tintNavBackground?: boolean;
	themeWholeNav?: boolean; // If false, only ribbon is themed; if true, whole nav is themed
};

export type BoardConfig = {
	foregroundColor: string;
	backgroundColor: string;
	autoForegroundColor?: boolean;
	showImage: boolean;
	bannerImageUrl: string;
	disableDynamicTheming?: boolean;
};

export type BoardCard = {
	id: string;
	title: string;
	imageUrl?: string;
	label?: { text: string; color: string };
	tags: string[];
	assignee?: string;
	issueKey: string;
	priority?: string;
	storyPoints?: number;
	dueDate?: string;
};

export type BoardColumnData = {
	title: string;
	color: string;
	count: number;
	cards: BoardCard[];
};

export type BoardTemplate = {
	id: string;
	name: string;
	imageUrl: string;
	theme: ThemeConfig;
};

export type NavTemplate = {
	id: string;
	name: string;
	theme: ThemeConfig;
};

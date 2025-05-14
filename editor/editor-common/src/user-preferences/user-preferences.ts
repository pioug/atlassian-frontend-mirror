export const TOOLBAR_DOCKING_POSITIONS = ['top', 'none'] as const;

export type ToolbarDocking = (typeof TOOLBAR_DOCKING_POSITIONS)[number];

export type UserPreferences = {
	toolbarDockingPosition?: ToolbarDocking;
};

type Must<T> = {
	[P in keyof T]-?: NonNullable<T[P]>;
};

export type ResolvedUserPreferences = Must<UserPreferences>;

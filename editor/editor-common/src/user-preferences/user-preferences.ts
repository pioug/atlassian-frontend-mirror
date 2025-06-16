export const TOOLBAR_DOCKING_POSITIONS = ['top', 'none'] as const;

export type ToolbarDocking = (typeof TOOLBAR_DOCKING_POSITIONS)[number];

export type UserPreferences = {
	toolbarDockingPosition?: ToolbarDocking;
};

/**
 * This type should contain all the user preferences
 * And we do expect all the attributes to be defined
 */
export type ResolvedUserPreferences = {
	toolbarDockingPosition: ToolbarDocking;
};

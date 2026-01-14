/**
 * Placement determines where a menu item should be rendered within the block menu hierarchy
 * - 'default': Under the TRANSFORM_CREATE_MENU_SECTION (nested within the Turn into submenu)
 * - 'featured': Directly under TRANSFORM_MENU_SECTION as a top-level item in the Turn into submenu
 */
export type BlockMenuPlacement = 'default' | 'featured';

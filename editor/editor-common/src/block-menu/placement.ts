/**
 * Placement determines where a menu item should be rendered within the block menu hierarchy
 * - 'default': Under the TRANSFORM_CREATE_MENU_SECTION (nested within the Turn into submenu)
 * - 'structure': Under the TRANSFORM_STRUCTURE_MENU_SECTION (nested within the Turn into submenu)
 * - 'featured': Directly under TRANSFORM_MENU_SECTION as a top-level item in the Turn into submenu
 * - 'featured-section': Registered as its own top-level section with a separator above
 */
export type BlockMenuPlacement = 'default' | 'structure' | 'featured' | 'featured-section';

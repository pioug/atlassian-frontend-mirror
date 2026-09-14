import { MENU_FOOTER_SECTION_KEY_SUFFIX } from './MENU_FOOTER_SECTION_KEY_SUFFIX';

/** Returns the reserved section key for a type-ahead menu's persistent footer item. */
export const getMenuFooterSectionKey = (menuKey: string): string =>
	`${menuKey}${MENU_FOOTER_SECTION_KEY_SUFFIX}`;

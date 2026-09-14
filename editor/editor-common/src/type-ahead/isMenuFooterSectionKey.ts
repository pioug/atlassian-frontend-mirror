import { MENU_FOOTER_SECTION_KEY_SUFFIX } from './MENU_FOOTER_SECTION_KEY_SUFFIX';

/** Identifies reserved type-ahead sections whose item is rendered as a persistent footer. */
export const isMenuFooterSectionKey = (key: string): boolean =>
	key.endsWith(MENU_FOOTER_SECTION_KEY_SUFFIX);

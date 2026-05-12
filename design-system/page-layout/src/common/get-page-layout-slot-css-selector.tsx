import { PAGE_LAYOUT_SLOT_SELECTOR } from './constants';

export const getPageLayoutSlotCSSSelector = (slotName: string) =>
	`[${PAGE_LAYOUT_SLOT_SELECTOR}='${slotName}']`;

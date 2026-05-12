import { PAGE_LAYOUT_SLOT_SELECTOR } from './constants';

export const getPageLayoutSlotSelector = (
	slotName: string,
): {
	'data-ds--page-layout--slot': string;
} => ({
	[PAGE_LAYOUT_SLOT_SELECTOR]: slotName,
});

import {
	ASK_ROVO_MENU_ITEM,
	EMOJI_MENU_ITEM,
	HYPERLINK_MENU_ITEM,
	MEDIA_INSERT_MENU_ITEM,
	MENTION_MENU_ITEM,
} from './keys';

export type IsRecommendedItemOptions = {
	itemKey: string;
};

/** Resolves an item's recommendation rank, or excludes it with `null`. */
export type IsRecommendedItemResult = number | null;

export type IsRecommendedItem = (options: IsRecommendedItemOptions) => IsRecommendedItemResult;

const defaultRanks: Readonly<Record<string, number>> = {
	[ASK_ROVO_MENU_ITEM.key]: 0,
	[HYPERLINK_MENU_ITEM.key]: 1,
	[MEDIA_INSERT_MENU_ITEM.key]: 2,
	[EMOJI_MENU_ITEM.key]: 3,
	[MENTION_MENU_ITEM.key]: 4,
};

/** Default Quick Insert recommendations in their intended display order. */
export const defaultIsRecommendedItem: IsRecommendedItem = ({ itemKey }) =>
	defaultRanks[itemKey] ?? null;

import {
	ASK_ROVO_MENU_ITEM,
	EMOJI_MENU_ITEM,
	HYPERLINK_MENU_ITEM,
	MEDIA_INSERT_MENU_ITEM,
	MENTION_MENU_ITEM,
} from './keys';

export type IsRecommendedItemOptions = {
	/** Registered key for native items; `manifestKey:moduleKey` for provider and extension items. */
	itemKey: string;
};

/** Resolves an item's recommendation, or excludes it with `null`. Lower ranks are shown first. */
export type IsRecommendedItemResult = { rank: number } | null;

export type IsRecommendedItem = (options: IsRecommendedItemOptions) => IsRecommendedItemResult;

/** Recommends the given item keys, ranked by their position in the list. */
export const createIsRecommendedItem = (orderedKeys: readonly string[]): IsRecommendedItem => {
	const ranks = new Map(orderedKeys.map((key, index) => [key, index]));
	return ({ itemKey }) => {
		const rank = ranks.get(itemKey);
		return rank === undefined ? null : { rank };
	};
};

/** Default Quick Insert recommendations in their intended display order. */
export const defaultIsRecommendedItem: IsRecommendedItem = createIsRecommendedItem([
	ASK_ROVO_MENU_ITEM.key,
	HYPERLINK_MENU_ITEM.key,
	MEDIA_INSERT_MENU_ITEM.key,
	EMOJI_MENU_ITEM.key,
	MENTION_MENU_ITEM.key,
]);

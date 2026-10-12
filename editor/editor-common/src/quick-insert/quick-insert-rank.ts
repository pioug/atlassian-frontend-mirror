import { isMenuFooterSectionKey } from '../type-ahead/isMenuFooterSectionKey';
import { isSectionOverflowItemKey } from '../type-ahead/isSectionOverflowItemKey';
import type { RegisteredItemRankResolver } from '../type-ahead/item-rank';
import { RECOMMENDED_SECTION } from './keys';

/** Recommendations and navigation controls retain their policy-defined order. */
export const createQuickInsertRankResolver = (
	getItemRank?: RegisteredItemRankResolver,
): RegisteredItemRankResolver | undefined => {
	if (!getItemRank) {
		return undefined;
	}

	return ({ component, parent }) => {
		if (
			component.type === 'menu-section' &&
			parent.type === 'menu' &&
			!isMenuFooterSectionKey(component.key)
		) {
			return getItemRank({ component, parent });
		}

		if (
			component.type === 'menu-item' &&
			parent.type === 'menu-section' &&
			!isSectionOverflowItemKey(component.key) &&
			!isMenuFooterSectionKey(parent.key) &&
			parent.key !== RECOMMENDED_SECTION.key
		) {
			return getItemRank({ component, parent });
		}

		return undefined;
	};
};

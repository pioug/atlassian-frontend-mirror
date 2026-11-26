import { logException } from '@atlaskit/editor-common/monitoring/error';
import { quickInsertProviderMenuItemKey } from '@atlaskit/editor-common/quick-insert/get-provider-menu-item-key';
import {
	defaultIsRecommendedItem,
	type IsRecommendedItem,
	type IsRecommendedItemResult,
} from '@atlaskit/editor-common/quick-insert/is-recommended-item';
import { isMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-is-menu-footer-section-key';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import type {
	RegisterComponent,
	RegisterMenuItem,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import type { RecommendedItemsResolver } from './registered-menu/get-quick-insert-menu-model';

export const MAX_RECOMMENDED_ITEMS = 5;

const isRecommendationCandidate = (component: RegisterComponent): component is RegisterMenuItem =>
	component.type === 'menu-item' &&
	!isSectionOverflowItemKey(component.key) &&
	!component.parents.some((parent) => isMenuFooterSectionKey(parent.key));

/** Normalises a consumer-supplied limit to the supported number of recommended items. */
export const resolveMaxRecommendedItems = (maxRecommendedItems?: number): number => {
	if (maxRecommendedItems === undefined || !Number.isFinite(maxRecommendedItems)) {
		return MAX_RECOMMENDED_ITEMS;
	}
	if (maxRecommendedItems > MAX_RECOMMENDED_ITEMS) {
		void logException(new Error('Quick Insert maxRecommendedItems exceeds the supported maximum'), {
			location: 'editor-plugin-quick-insert/getRecommendedComponents',
		});
	}
	return Math.min(Math.max(Math.floor(maxRecommendedItems), 1), MAX_RECOMMENDED_ITEMS);
};

/**
 * Ranks candidates by `isRecommendedItem` and keeps the first `maxRecommendedItems`. Both menus
 * use this, so an item is recommended in the same cases in each.
 */
export const rankRecommendedItems = <T>({
	candidates,
	getItemKey,
	isHidden,
	isRecommendedItem = defaultIsRecommendedItem,
	maxRecommendedItems,
}: {
	candidates: readonly T[];
	getItemKey: (candidate: T) => string;
	isHidden?: (candidate: T) => boolean;
	isRecommendedItem?: IsRecommendedItem;
	maxRecommendedItems?: number;
}): T[] =>
	candidates
		.flatMap((candidate, index) => {
			const result: IsRecommendedItemResult = isRecommendedItem({ itemKey: getItemKey(candidate) });
			if (result === null) {
				return [];
			}
			if (Number.isNaN(result.rank)) {
				void logException(new Error('Invalid Quick Insert recommended item rank'), {
					location: 'editor-plugin-quick-insert/getRecommendedComponents',
				});
				return [];
			}
			if (isHidden?.(candidate)) {
				return [];
			}

			return [{ candidate, index, rank: result.rank }];
		})
		.sort((first, second) =>
			first.rank === second.rank ? first.index - second.index : first.rank - second.rank,
		)
		.slice(0, resolveMaxRecommendedItems(maxRecommendedItems))
		.map(({ candidate }) => candidate);

export const getRecommendedComponents = ({
	components,
	context,
	isRecommendedItem,
	maxRecommendedItems,
}: {
	components: RegisterComponent[];
	context: SurfaceContext;
	isRecommendedItem?: IsRecommendedItem;
	maxRecommendedItems?: number;
}): RegisterMenuItem[] =>
	rankRecommendedItems({
		candidates: components.filter(isRecommendationCandidate),
		// Provider items are namespaced in the registry; consumers rank them by their source key.
		getItemKey: (component) => quickInsertProviderMenuItemKey.getSourceKey(component.key),
		isHidden: (component) => component.isHidden?.({ surfaceContext: context }) === true,
		isRecommendedItem,
		maxRecommendedItems,
	});

/**
 * Resolves the Recommended section for a browse-mode menu. Callers memoise per components array,
 * so the resolver itself keeps no state.
 */
export const createRecommendedItemsResolver =
	({
		isRecommendedItem,
		maxRecommendedItems,
	}: {
		isRecommendedItem?: IsRecommendedItem;
		maxRecommendedItems?: number;
	}): RecommendedItemsResolver =>
	({ components, surfaceContext }) =>
		surfaceContext
			? getRecommendedComponents({
					components,
					context: surfaceContext,
					isRecommendedItem,
					maxRecommendedItems,
				})
			: [];

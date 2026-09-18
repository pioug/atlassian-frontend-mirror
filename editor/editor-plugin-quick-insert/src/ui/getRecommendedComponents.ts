import { logException } from '@atlaskit/editor-common/monitoring';
import {
	defaultIsRecommendedItem,
	type IsRecommendedItem,
	type IsRecommendedItemResult,
} from '@atlaskit/editor-common/quick-insert/is-recommended-item';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import { isMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-is-menu-footer-section-key';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import { TYPE_AHEAD_SURFACE_CONTEXT } from '@atlaskit/editor-common/type-ahead-surface-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type {
	RegisterComponent,
	RegisterMenuItem,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import type { QuickInsertPlugin } from '../quickInsertPluginType';

export const MAX_RECOMMENDED_ITEMS = 5;
export const RECOMMENDED_SLOT_KEY_PREFIX = 'quick-insert-recommended-slot-';

export const isRecommendedSlotKey = (key: string): boolean =>
	key.startsWith(RECOMMENDED_SLOT_KEY_PREFIX);

const isRecommendationCandidate = (component: RegisterComponent): component is RegisterMenuItem =>
	component.type === 'menu-item' &&
	!isRecommendedSlotKey(component.key) &&
	!isSectionOverflowItemKey(component.key) &&
	!component.parents.some((parent) => isMenuFooterSectionKey(parent.key));

export const getRecommendedComponents = ({
	components,
	context,
	isRecommendedItem = defaultIsRecommendedItem,
}: {
	components: RegisterComponent[];
	context: SurfaceContext;
	isRecommendedItem?: IsRecommendedItem;
}): RegisterMenuItem[] => {
	return components
		.filter(isRecommendationCandidate)
		.flatMap((component, index) => {
			const result: IsRecommendedItemResult = isRecommendedItem({ itemKey: component.key });
			if (result === null) {
				return [];
			}
			if (Number.isNaN(result)) {
				void logException(new Error('Invalid Quick Insert recommended item rank'), {
					location: 'editor-plugin-quick-insert/getRecommendedComponents',
				});
				return [];
			}
			if (component.isHidden?.({ surfaceContext: context })) {
				return [];
			}

			return [{ component, index, rank: result }];
		})
		.sort((first, second) =>
			first.rank === second.rank ? first.index - second.index : first.rank - second.rank,
		)
		.slice(0, MAX_RECOMMENDED_ITEMS)
		.map(({ component }) => component);
};

/** Keeps only the current menu-open recommendation snapshot. */
type RecommendedSnapshotCache = {
	getSnapshot: (surfaceContext?: SurfaceContext) => RegisterMenuItem[];
};

export const createRecommendedSnapshotCache = ({
	api,
	isRecommendedItem,
}: {
	api: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
	isRecommendedItem?: IsRecommendedItem;
}): RecommendedSnapshotCache => {
	let snapshot: { id: symbol; items: RegisterMenuItem[] } | undefined;

	const getSnapshot = (surfaceContext?: SurfaceContext): RegisterMenuItem[] => {
		const menuOpenId = surfaceContext?.get(TYPE_AHEAD_SURFACE_CONTEXT)?.menuOpenId;
		if (!surfaceContext || !menuOpenId) {
			return [];
		}
		if (snapshot?.id !== menuOpenId) {
			snapshot = {
				id: menuOpenId,
				items: getRecommendedComponents({
					components: api?.uiControlRegistry?.actions.getComponents(MENU.key) ?? [],
					context: surfaceContext,
					isRecommendedItem,
				}),
			};
		}
		return snapshot.items;
	};

	return { getSnapshot };
};

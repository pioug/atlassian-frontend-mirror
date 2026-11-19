import type {
	RegisterComponent,
	RegisterComponentParent,
} from '@atlaskit/editor-ui-control-model/types';

import { resolveRegisteredItemRank } from './resolve-registered-item-rank';

export type RegisteredItemRankContext = {
	component: RegisterComponent;
	parent: RegisterComponentParent;
};

export type RegisteredItemRankOverride = { rank: number };

/** Pure parent-rank override. Return undefined to preserve parent.rank; do not mutate either record. */
export type RegisteredItemRankResolver = (
	context: RegisteredItemRankContext,
) => RegisteredItemRankOverride | undefined;

/** Applies per-editor parent ranks without changing shared registry records. */
export const applyRegisteredItemRanks = (
	components: RegisterComponent[],
	getRegisteredItemRank?: RegisteredItemRankResolver,
): RegisterComponent[] => {
	if (!getRegisteredItemRank) {
		return components;
	}

	return components.map((component) => {
		if (!component.parents) {
			return component;
		}

		const parents = component.parents.map((parent) => ({
			...parent,
			rank: resolveRegisteredItemRank(component, parent, getRegisteredItemRank),
		}));

		return Object.assign({}, component, { parents });
	});
};

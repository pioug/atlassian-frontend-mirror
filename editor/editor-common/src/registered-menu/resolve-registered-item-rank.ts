import type {
	RegisterComponent,
	RegisterComponentParent,
} from '@atlaskit/editor-ui-control-model/types';

import type { RegisteredItemRankResolver } from './item-rank';

export const resolveRegisteredItemRank = (
	component: RegisterComponent,
	parent: RegisterComponentParent,
	getItemRank?: RegisteredItemRankResolver,
): number => {
	const rank = getItemRank?.({ component, parent })?.rank;
	return typeof rank === 'number' && Number.isFinite(rank) ? rank : parent.rank;
};

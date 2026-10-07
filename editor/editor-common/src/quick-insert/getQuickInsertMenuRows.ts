import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';

import type { QuickInsertMenuModel } from './build-quick-insert-menu-model';

export const getQuickInsertMenuRows = (
	model: QuickInsertMenuModel,
): Array<RegisterMenuItem | RegisterMenuSection> => [
	...(model.searchResults ?? model.sections.flat()),
	...(model.fallbackItems ?? []),
];

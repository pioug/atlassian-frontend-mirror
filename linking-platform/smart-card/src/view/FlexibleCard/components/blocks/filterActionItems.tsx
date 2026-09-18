import type { ProductType } from '@atlaskit/linking-common/types';

import { ActionName } from '../../../../constants';
import type { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { type ActionItem } from './types';

export const filterActionItems = (
	items: ActionItem[] = [],
	context?: FlexibleUiDataContext,
	product?: ProductType,
): ActionItem[] => {
	return items.filter((item) => {
		switch (item.name) {
			case ActionName.DeleteAction:
			case ActionName.EditAction:
			case ActionName.CustomAction:
				// Named and custom actions that user defines.
				return Boolean(ActionName[item.name]);
			case ActionName.RovoChatAction:
				if (!!product && product === 'CONFLUENCE') {
					return Boolean(ActionName[item.name]);
				}
				// same as default case below
				if (context?.actions === undefined) {
					return false;
				}
				return Boolean(
					item.name in context.actions
						? context.actions[item.name as keyof typeof context.actions]
						: undefined,
				);
			default:
				// Action that require data from the data context to render.
				if (context?.actions === undefined) {
					return false;
				}
				return Boolean(
					item.name in context.actions
						? context.actions[item.name as keyof typeof context.actions]
						: undefined,
				);
		}
	});
};

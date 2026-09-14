import { type FileDetails } from '@atlaskit/media-client';

import type { CardAction } from './actions';

export function attachDetailsToActions(
	actions: Array<CardAction>,
	details: FileDetails,
): Array<CardAction> {
	return actions.map((action: CardAction) => ({
		...action,
		handler: () => {
			action.handler({ type: 'file', details });
		},
	}));
}

import React from 'react';
import { type FileItem, type FileDetails } from '@atlaskit/media-client';
import { type ReactNode } from 'react';
import DownloadIcon from '@atlaskit/icon/core/migration/download';

export interface CardAction {
	label?: string;
	handler: CardEventHandler;
	icon?: ReactNode;
}

export type CardEventHandler = (item?: FileItem, event?: Event) => void;

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

export const createDownloadAction = (handler: CardEventHandler) => ({
	label: 'Download',
	icon: <DownloadIcon color="currentColor" spacing="spacious" label="Download" />,
	handler,
});

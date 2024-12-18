import React from 'react';
import { type FileItem, type FileDetails } from '@atlaskit/media-client';
import { type ReactNode } from 'react';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import { messages } from '@atlaskit/media-ui';
import { type MessageDescriptor } from 'react-intl-next';

export interface CardAction {
	label?: string;
	handler: CardEventHandler;
	icon?: ReactNode;
	isDisabled?: boolean;
	tooltip?: string;
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

type FormatMessageFn = (descriptor: MessageDescriptor) => string;

export const createDownloadAction = (
	baseAction: CardAction,
	formatMessage: FormatMessageFn,
): CardAction => {
	const label = baseAction.isDisabled ? 'Download Disabled' : 'Download';
	const tooltip = baseAction.isDisabled
		? formatMessage(messages.download_disabled_security_policy)
		: undefined;

	return {
		...baseAction,
		label,
		tooltip,
		icon: <DownloadIcon color="currentColor" spacing="spacious" label="Download" />,
	};
};

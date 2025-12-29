import React from 'react';
import { type FileItem, type FileDetails } from '@atlaskit/media-client';
import { type ReactNode } from 'react';
import DownloadIcon from '@atlaskit/icon/core/download';
import { messages } from '@atlaskit/media-ui';
import { type MessageDescriptor } from 'react-intl-next';
import { token } from '@atlaskit/tokens';

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
	const { isDisabled } = baseAction;
	const label = isDisabled ? 'Download Disabled' : 'Download';
	const tooltip = isDisabled
		? formatMessage(messages.download_disabled_security_policy)
		: undefined;

	return {
		...baseAction,
		label,
		tooltip,
		icon: (
			<DownloadIcon
				color={isDisabled ? token('color.icon.disabled') : 'currentColor'}
				spacing="spacious"
				label="Download"
			/>
		),
	};
};

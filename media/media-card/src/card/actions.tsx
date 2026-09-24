import { type ReactNode } from 'react';

import { type FileItem } from '@atlaskit/media-client';

export interface CardAction {
	label?: string;
	handler: CardEventHandler;
	icon?: ReactNode;
	isDisabled?: boolean;
	tooltip?: string;
}

export type CardEventHandler = (item?: FileItem, event?: Event) => void;

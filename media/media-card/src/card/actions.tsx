/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
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

/**
 * @deprecated Use `import { attachDetailsToActions } from '@atlaskit/media-card/attach-details-to-actions'` instead.
 */
export { attachDetailsToActions } from './attachDetailsToActions';
/**
 * @deprecated Use `import { createDownloadAction } from '@atlaskit/media-card/create-download-action'` instead.
 */
export { createDownloadAction } from './createDownloadAction';

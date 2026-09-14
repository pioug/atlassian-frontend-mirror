import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { MediaClient } from '@atlaskit/media-client';
import { withMediaAnalyticsContext, type MediaFeatureFlags } from '@atlaskit/media-common';

import {
	type BrowserConfig,
	type UploadEndEventPayload,
	type UploadErrorEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
} from '../../types';
import { getPackageAttributes } from '../../util/getPackageAttributes';
import { type LocalUploadComponentBaseProps } from '../localUploadReact';
import type { LocalUploadConfig } from '../types';
import { BrowserBase } from './BrowserBase';
import { COMPONENT_NAME } from './componentName';

export interface BrowserOwnProps {
	config: BrowserConfig;
	/**
	 * when true, the dialog will show when the component is rendered
	 * (NOTE: without this value, no dialog will appear unless you use the **onBrowserFn** hook)
	 */
	isOpen?: boolean;
	// Fires when browser dialog is closed.
	onClose?: () => void;
	/**
	 * This prop will be mainly used for those contexts (like Editor) where there is no react lifecylce and we cannot rerender easily.
	 * Otherwise, isOpen prop is preferred.
	 */
	onBrowseFn?: (browse: () => void) => void;
	// Provides a callback which can be used to manually cancel an upload if required
	onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
	// You can pass a children factory in a shape of (browse) => React.ReactChild
	children?: (browse: () => void) => React.ReactChild;
}

export type BrowseFn = () => void;

export type BrowserProps = LocalUploadComponentBaseProps & BrowserOwnProps;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export default BrowserBase;

export const Browser: React.ForwardRefExoticComponent<
	Omit<
		Pick<
			Omit<
				{
					mediaClient: MediaClient;
					config: LocalUploadConfig;
					onUploadsStart?: (payload: UploadsStartEventPayload) => void;
					onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
					onEnd?: (payload: UploadEndEventPayload) => void;
					onError?: (payload: UploadErrorEventPayload) => void;
					featureFlags?: MediaFeatureFlags;
				} & BrowserOwnProps,
				keyof WithAnalyticsEventsProps
			>,
			| 'children'
			| 'onError'
			| 'mediaClient'
			| 'onUploadsStart'
			| 'onPreviewUpdate'
			| 'onEnd'
			| 'featureFlags'
			| 'isOpen'
			| 'onClose'
			| 'onBrowseFn'
			| 'onCancelFn'
		> & {
			config?: (LocalUploadConfig & BrowserConfig) | undefined;
		} & {} & React.RefAttributes<any>,
		'ref'
	> &
		React.RefAttributes<any>
> = withMediaAnalyticsContext(getPackageAttributes(COMPONENT_NAME))(
	withAnalyticsEvents()(BrowserBase),
);

import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { MediaClient } from '@atlaskit/media-client';
import { type MediaFeatureFlags, withMediaAnalyticsContext } from '@atlaskit/media-common';

import {
	type ClipboardConfig,
	type UploadEndEventPayload,
	type UploadErrorEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
} from '../../types';
import { getPackageAttributes } from '../../util/getPackageAttributes';
import { type LocalUploadComponentBaseProps } from '../localUploadReact';
import type { LocalUploadConfig } from '../types';
import { ClipboardBase } from './ClipboardBase';
import { COMPONENT_NAME } from './componentName';

export interface ClipboardOwnProps {
	config: ClipboardConfig;
}

export type ClipboardProps = LocalUploadComponentBaseProps & {
	config: ClipboardConfig;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export default ClipboardBase;

export const Clipboard: React.ForwardRefExoticComponent<
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
				} & {
					config: ClipboardConfig;
				},
				keyof WithAnalyticsEventsProps
			>,
			'onError' | 'mediaClient' | 'onUploadsStart' | 'onPreviewUpdate' | 'onEnd' | 'featureFlags'
		> & {
			config?: (LocalUploadConfig & ClipboardConfig) | undefined;
		} & {} & React.RefAttributes<any>,
		'ref'
	> &
		React.RefAttributes<any>
> = withMediaAnalyticsContext(getPackageAttributes(COMPONENT_NAME))(
	withAnalyticsEvents()(ClipboardBase),
);

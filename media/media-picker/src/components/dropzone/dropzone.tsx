import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { MediaClient } from '@atlaskit/media-client';
import { withMediaAnalyticsContext, type MediaFeatureFlags } from '@atlaskit/media-common';

import {
	type DropzoneConfig,
	type UploadEndEventPayload,
	type UploadErrorEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
} from '../../types';
import { getPackageAttributes } from '../../util/getPackageAttributes';
import { type LocalUploadComponentBaseProps } from '../localUploadReact';
import {
	type DropzoneDragEnterEventPayload,
	type DropzoneDragLeaveEventPayload,
	type LocalUploadConfig,
} from '../types';
import { COMPONENT_NAME } from './componentName';
import { DropzoneBase } from './DropzoneBase';

export type DropzoneProps = LocalUploadComponentBaseProps & {
	//config
	config: DropzoneConfig;
	//Fired when a file is dropped on the drop zone
	onDrop?: () => void;
	//Fired when a file is dragged over the drop zone
	onDragEnter?: (payload: DropzoneDragEnterEventPayload) => void;
	//Fired when a file is dragged away from the drop zone after entering
	onDragLeave?: (payload: DropzoneDragLeaveEventPayload) => void;
	//Provides a callback which can be used to manually cancel an upload if required
	onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports
export default DropzoneBase;

export const Dropzone: React.ForwardRefExoticComponent<
	Omit<
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
				//config
				config: DropzoneConfig;
				//Fired when a file is dropped on the drop zone
				onDrop?: () => void;
				//Fired when a file is dragged over the drop zone
				onDragEnter?: (payload: DropzoneDragEnterEventPayload) => void;
				//Fired when a file is dragged away from the drop zone after entering
				onDragLeave?: (payload: DropzoneDragLeaveEventPayload) => void;
				//Provides a callback which can be used to manually cancel an upload if required
				onCancelFn?: (cancel: (uniqueIdentifier: string) => void) => void;
			},
			keyof WithAnalyticsEventsProps
		> &
			React.RefAttributes<any>,
		'ref'
	> &
		React.RefAttributes<any>
> = withMediaAnalyticsContext(getPackageAttributes(COMPONENT_NAME))(
	withAnalyticsEvents()(DropzoneBase),
);

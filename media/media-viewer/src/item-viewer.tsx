import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import { type FileState, type Identifier, isFileIdentifier } from '@atlaskit/media-client';
import { type MediaFeatureFlags, type MediaTraceContext } from '@atlaskit/media-common';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';

import type { Outcome } from './domain/outcome';
import { ItemViewerBase } from './ItemViewerBase';
import type { MediaViewerError } from './MediaViewerError';
import { type ViewerOptionsProps } from './viewerOptions';

export type Props = Readonly<{
	identifier: Identifier;
	onClose?: () => void;
	previewCount: number;
	contextId?: string;
	featureFlags?: MediaFeatureFlags;
	viewerOptions?: ViewerOptionsProps;
	traceContext: MediaTraceContext;
}> &
	WithAnalyticsEventsProps &
	WithShowControlMethodProp;

export type FileItem = FileState | 'external-image';

export type State = Outcome<FileItem, MediaViewerError>;

export const MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER: number = 10 * 1024 * 1024;

const ViewerWithKey = (props: Props) => {
	const { identifier } = props;
	const key = isFileIdentifier(identifier) ? identifier.id : identifier.dataURI;
	return <ItemViewerBase {...props} key={key} />;
};

export const ItemViewer: React.ForwardRefExoticComponent<
	Omit<
		Readonly<{
			identifier: Identifier;
			onClose?: () => void;
			previewCount: number;
			contextId?: string;
			featureFlags?: MediaFeatureFlags;
			viewerOptions?: ViewerOptionsProps;
			traceContext: MediaTraceContext;
		}> &
			WithShowControlMethodProp,
		keyof WithAnalyticsEventsProps
	> &
		React.RefAttributes<any>
> = withAnalyticsEvents()(ViewerWithKey);

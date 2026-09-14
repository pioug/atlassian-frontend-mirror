import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import { type Camera } from '@atlaskit/media-ui/camera/camera';
import { type Vector2 } from '@atlaskit/media-ui/vector2';

import { createClosedEvent } from '../../analytics/events/ui/closed';
import { type ZoomLevel } from '../../domain/zoomLevel';
import { InteractiveImgComponent } from './interactive-img-component';

export interface Props extends WithAnalyticsEventsProps {
	src: string;
	alt: string;
	originalBinaryImageSrc?: string;
	orientation?: number;
	onClose?: () => void;
	onLoad?: () => void;
	onError?: () => void;
	onBlanketClicked?: () => void;
}

export type State = {
	zoomLevel: ZoomLevel;
	isHDActive: boolean;
	isHDAvailable: boolean;
	isHDActivating: boolean;
	camera?: Camera;
	isDragging: boolean;
	cursorPos: Vector2;
	hasBeenLoadedOnce: boolean;
};

export const InteractiveImg: React.ForwardRefExoticComponent<
	Omit<Props, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents({
	onBlanketClicked: (createAnalyticsEvent) => {
		const event = createAnalyticsEvent(createClosedEvent('blanket'));
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	},
})(InteractiveImgComponent);

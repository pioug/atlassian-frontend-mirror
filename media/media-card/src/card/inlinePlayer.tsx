import React from 'react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import { type FileIdentifier } from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type CardDimensions } from '../types';
import type { CardPreview } from '../types';
import { InlinePlayerBase } from './InlinePlayerBase';

export interface InlinePlayerOwnProps {
	identifier: FileIdentifier;
	dimensions?: CardDimensions;
	originalDimensions?: NumericalCardDimensions;
	autoplay: boolean;
	selected?: boolean;
	onFullscreenChange?: (fullscreen: boolean) => void;
	onError?: (error: Error) => void;
	readonly onClick?: (
		event: React.MouseEvent<HTMLDivElement>,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	testId?: string;
	readonly cardPreview?: CardPreview;
	//To Forward Ref
	readonly forwardRef?: React.Ref<HTMLDivElement>;
	readonly videoControlsWrapperRef?: React.Ref<HTMLDivElement>;
}

export type InlinePlayerProps = InlinePlayerOwnProps & WithAnalyticsEventsProps;

const InlinePlayerForwardRef = React.forwardRef<HTMLDivElement, InlinePlayerProps>((props, ref) => {
	return <InlinePlayerBase {...props} forwardRef={ref} />;
});

export const InlinePlayer: React.ForwardRefExoticComponent<
	Omit<InlinePlayerProps, 'ref'> & React.RefAttributes<HTMLDivElement>
> = InlinePlayerForwardRef;

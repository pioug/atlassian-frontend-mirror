import React, { forwardRef } from 'react';
import {
	VolumeWrapper as EmotionVolumeWrapper,
	CurrentTime as EmotionCurrentTime,
	TimeLine as EmotionTimeLine,
	CurrentTimeLine as EmotionCurrentTimeLine,
	Thumb as EmotionThumb,
	CurrentTimeLineThumb as EmotionCurrentTimeLineThumb,
	BufferedTime as EmotionBufferedTime,
	LeftControls as EmotionLeftControls,
	RightControls as EmotionRightControls,
	VolumeToggleWrapper as EmotionVolumeToggleWrapper,
	VolumeTimeRangeWrapper as EmotionVolumeTimeRangeWrapper,
	MutedIndicator as EmotionMutedIndicator,
} from './styled-emotion';
import {
	VolumeWrapper as CompiledVolumeWrapper,
	CurrentTime as CompiledCurrentTime,
	TimeLine as CompiledTimeLine,
	CurrentTimeLine as CompiledCurrentTimeLine,
	Thumb as CompiledThumb,
	CurrentTimeLineThumb as CompiledCurrentTimeLineThumb,
	BufferedTime as CompiledBufferedTime,
	LeftControls as CompiledLeftControls,
	RightControls as CompiledRightControls,
	VolumeToggleWrapper as CompiledVolumeToggleWrapper,
	VolumeTimeRangeWrapper as CompiledVolumeTimeRangeWrapper,
	MutedIndicator as CompiledMutedIndicator,
	type VolumeWrapperProps,
	type MutedIndicatorProps,
} from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const VolumeWrapper = (
	props: VolumeWrapperProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledVolumeWrapper {...props} />
	) : (
		<EmotionVolumeWrapper {...props} />
	);

export const CurrentTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledCurrentTime {...props} />
	) : (
		<EmotionCurrentTime {...props} />
	);

export const TimeLine = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return fg('platform_media_compiled') ? (
			<CompiledTimeLine {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		) : (
			<EmotionTimeLine {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		);
	},
);

export const CurrentTimeLine = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledCurrentTimeLine {...props} />
	) : (
		<EmotionCurrentTimeLine {...props} />
	);

export const Thumb = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (fg('platform_media_compiled') ? <CompiledThumb {...props} /> : <EmotionThumb {...props} />);

export const CurrentTimeLineThumb = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return fg('platform_media_compiled') ? (
			<CompiledCurrentTimeLineThumb {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		) : (
			<EmotionCurrentTimeLineThumb {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		);
	},
);

export const BufferedTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledBufferedTime {...props} />
	) : (
		<EmotionBufferedTime {...props} />
	);

export const LeftControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledLeftControls {...props} />
	) : (
		<EmotionLeftControls {...props} />
	);

export const RightControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledRightControls {...props} />
	) : (
		<EmotionRightControls {...props} />
	);

export const VolumeToggleWrapper = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledVolumeToggleWrapper {...props} />
	) : (
		<EmotionVolumeToggleWrapper {...props} />
	);

export const VolumeTimeRangeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledVolumeTimeRangeWrapper {...props} />
	) : (
		<EmotionVolumeTimeRangeWrapper {...props} />
	);

export const MutedIndicator = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledMutedIndicator {...props} />
	) : (
		<EmotionMutedIndicator {...props} />
	);

export type { MutedIndicatorProps } from './styled-compiled';
export type { CurrentTimeTooltipProps } from './styled-emotion';

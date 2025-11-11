import React, { forwardRef } from 'react';
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

export const VolumeWrapper = (
	props: VolumeWrapperProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledVolumeWrapper {...props} />
);

export const CurrentTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledCurrentTime {...props} />
);

export const TimeLine = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<CompiledTimeLine {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		);

	},
);

export const CurrentTimeLine = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledCurrentTimeLine {...props} />
);

export const Thumb = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (<CompiledThumb {...props} />);

export const CurrentTimeLineThumb = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<CompiledCurrentTimeLineThumb {...props} ref={ref as React.RefObject<HTMLDivElement>} />
		);

	},
);

export const BufferedTime = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledBufferedTime {...props} />
);

export const LeftControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledLeftControls {...props} />
);

export const RightControls = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledRightControls {...props} />
);

export const VolumeToggleWrapper = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledVolumeToggleWrapper {...props} />
);

export const VolumeTimeRangeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledVolumeTimeRangeWrapper {...props} />
);

export const MutedIndicator = (
	props: MutedIndicatorProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => (
	<CompiledMutedIndicator {...props} />
);


export type { MutedIndicatorProps, CurrentTimeTooltipProps } from './styled-compiled';

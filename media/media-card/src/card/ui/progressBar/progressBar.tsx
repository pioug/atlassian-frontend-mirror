import React from 'react';
import { StyledBar } from './styledBar';
import { Breakpoint } from '../common';

export type ProgressBarProps = {
	progress?: number;
	breakpoint?: Breakpoint;
	positionBottom?: boolean;
	showOnTop?: boolean;
	ariaLabel?: string;
};

export const getNormalizedProgress = (progress?: number) => {
	return Math.min(1, Math.max(0, progress || 0)) * 100;
};

export const ProgressBar = ({
	progress,
	breakpoint = Breakpoint.SMALL,
	positionBottom = false,
	showOnTop = false,
	ariaLabel = 'Loading progress',
}: ProgressBarProps) => {
	return (
		<StyledBar
			progress={getNormalizedProgress(progress)}
			breakpoint={breakpoint}
			positionBottom={positionBottom}
			showOnTop={showOnTop}
			ariaLabel={ariaLabel}
		/>
	);
};

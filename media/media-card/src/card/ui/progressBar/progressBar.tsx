import React from 'react';

import { Breakpoint } from '../common';
import { getNormalizedProgress } from './getNormalizedProgress';
import { StyledBar } from './styledBar';

export type ProgressBarProps = {
	progress?: number;
	breakpoint?: Breakpoint;
	positionBottom?: boolean;
	showOnTop?: boolean;
	ariaLabel?: string;
};

export const ProgressBar = ({
	progress,
	breakpoint = Breakpoint.SMALL,
	positionBottom = false,
	showOnTop = false,
	ariaLabel = 'Loading progress',
}: ProgressBarProps): React.JSX.Element => {
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

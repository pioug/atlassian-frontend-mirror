import React, { forwardRef } from 'react';

import {
	TimeLine as CompiledTimeLine,
	CurrentTimeLineThumb as CompiledCurrentTimeLineThumb,
} from './styled-compiled';

export const TimeLine: React.ForwardRefExoticComponent<
	Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<unknown>
> = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return <CompiledTimeLine {...props} ref={ref as React.RefObject<HTMLDivElement>} />;
	},
);

export const CurrentTimeLineThumb: React.ForwardRefExoticComponent<
	Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<unknown>
> = forwardRef(
	(
		props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return <CompiledCurrentTimeLineThumb {...props} ref={ref as React.RefObject<HTMLDivElement>} />;
	},
);

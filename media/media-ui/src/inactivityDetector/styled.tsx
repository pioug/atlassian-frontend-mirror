import React, { forwardRef } from 'react';
import {
	InactivityDetectorWrapper as CompiledInactivityDetectorWrapper,
	type ContentWrapperProps,
} from './styled-compiled';

export const InactivityDetectorWrapper: React.ForwardRefExoticComponent<Omit<ContentWrapperProps & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<unknown>> = forwardRef(
	(
		props: ContentWrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => (
		<CompiledInactivityDetectorWrapper {...props} ref={ref as React.RefObject<HTMLDivElement>} />
	),
);

export type { ContentWrapperProps } from './styled-compiled';

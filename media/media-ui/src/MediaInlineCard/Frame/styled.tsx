import React from 'react';
import { Wrapper as CompiledWrapper, type WrapperProps } from './styled-compiled';

export const Wrapper: React.ForwardRefExoticComponent<Omit<WrapperProps & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>> = React.forwardRef(
	(
		props: WrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
		ref: React.Ref<HTMLSpanElement>,
	) => <CompiledWrapper {...props} ref={ref} />,
);

export type { WrapperProps } from './styled-compiled';

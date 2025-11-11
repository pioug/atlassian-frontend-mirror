import React from 'react';
import { Wrapper as CompiledWrapper, type WrapperProps } from './styled-compiled';

export const Wrapper = React.forwardRef(
	(
		props: WrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
		ref: React.Ref<HTMLSpanElement>,
	) => <CompiledWrapper {...props} ref={ref} />,
);

export type { WrapperProps } from './styled-compiled';

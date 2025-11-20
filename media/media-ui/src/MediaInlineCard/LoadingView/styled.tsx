import React from 'react';
import { SpinnerWrapper as CompiledSpinnerWrapper } from './styled-compiled';

export const SpinnerWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledSpinnerWrapper {...props} />;

import React from 'react';

import { StyledBar as CompiledStyledBar } from './StyledBar-2';
import { type StyledBarProps } from './types';

export const StyledBar = (props: StyledBarProps): React.JSX.Element => (
	<CompiledStyledBar {...props} />
);

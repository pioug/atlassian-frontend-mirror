import React from 'react';

import { IconWrapper as CompiledIconWrapper } from './IconWrapper-2';
import { type IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps): React.JSX.Element => (
	<CompiledIconWrapper {...props} />
);

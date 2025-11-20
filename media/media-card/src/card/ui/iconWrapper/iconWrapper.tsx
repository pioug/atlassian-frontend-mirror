import React from 'react';
import { IconWrapper as CompiledIconWrapper } from './iconWrapper-compiled';

import { type IconWrapperProps } from './types';

export const IconWrapper = (props: IconWrapperProps): React.JSX.Element => (
	<CompiledIconWrapper {...props} />
);

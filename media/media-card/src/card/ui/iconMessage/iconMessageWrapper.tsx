import React from 'react';

import { IconMessageWrapper as CompiledIconMessageWrapper } from './iconMessageWrapper-compiled';
import { type IconMessageWrapperProps } from './types';

export const IconMessageWrapper = (props: IconMessageWrapperProps): React.JSX.Element => (
	<CompiledIconMessageWrapper {...props} />
);

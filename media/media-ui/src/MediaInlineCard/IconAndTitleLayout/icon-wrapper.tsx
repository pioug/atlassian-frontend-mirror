import React from 'react';

import { IconWrapper as CompiledIconWrapper } from './icon-wrapper-compiled';

export const IconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconWrapper {...props} />;

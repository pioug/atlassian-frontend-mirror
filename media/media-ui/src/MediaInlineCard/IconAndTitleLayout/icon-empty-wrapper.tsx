import React from 'react';

import { IconEmptyWrapper as CompiledIconEmptyWrapper } from './icon-empty-wrapper-compiled';

export const IconEmptyWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconEmptyWrapper {...props} />;

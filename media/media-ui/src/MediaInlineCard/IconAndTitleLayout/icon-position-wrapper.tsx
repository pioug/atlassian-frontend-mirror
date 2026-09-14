import React from 'react';

import { IconPositionWrapper as CompiledIconPositionWrapper } from './icon-position-wrapper-compiled';

export const IconPositionWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconPositionWrapper {...props} />;

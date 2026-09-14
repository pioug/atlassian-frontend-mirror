import React from 'react';

import { IconTitleWrapper as CompiledIconTitleWrapper } from './icon-title-wrapper-compiled';

export const IconTitleWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledIconTitleWrapper {...props} />;

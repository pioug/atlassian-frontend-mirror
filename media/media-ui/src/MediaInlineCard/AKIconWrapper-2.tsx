import React from 'react';

import { AKIconWrapper as CompiledAKIconWrapper } from './AKIconWrapper';

export const AKIconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
): React.JSX.Element => <CompiledAKIconWrapper {...props} />;

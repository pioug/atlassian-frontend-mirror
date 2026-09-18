import React from 'react';

import { TickBoxWrapper as CompiledTickBoxWrapper } from './tickBoxWrapper-compiled';
import { type TickBoxProps } from './types';

export const TickBoxWrapper: {
	(props: TickBoxProps): React.JSX.Element;
	displayName: string;
} = (props: TickBoxProps): React.JSX.Element => <CompiledTickBoxWrapper {...props} />;

TickBoxWrapper.displayName = 'TickBoxWrapper';

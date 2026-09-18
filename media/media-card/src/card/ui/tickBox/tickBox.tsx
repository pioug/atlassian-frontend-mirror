import React from 'react';

import TickIcon from '@atlaskit/icon/core/check-mark';

import { TickBoxWrapper } from './tickBoxWrapper';
import { type TickBoxProps } from './types';

export const TickBox = ({ selected }: TickBoxProps): React.JSX.Element => (
	<TickBoxWrapper selected={selected}>
		<TickIcon color="currentColor" label="tick" size="small" />
	</TickBoxWrapper>
);

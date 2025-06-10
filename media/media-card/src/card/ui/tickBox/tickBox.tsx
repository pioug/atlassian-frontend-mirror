import React from 'react';
import TickIcon from '@atlaskit/icon/core/migration/check-mark--check';
import { type TickBoxProps } from './types';
import { TickBoxWrapper } from './tickBoxWrapper';

export const TickBox = ({ selected }: TickBoxProps) => (
	<TickBoxWrapper selected={selected}>
		<TickIcon color="currentColor" label="tick" size="small" />
	</TickBoxWrapper>
);

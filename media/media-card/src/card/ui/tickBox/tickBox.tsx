import React from 'react';
import TickIcon from '@atlaskit/icon/glyph/check';
import { type TickBoxProps } from './types';
import { TickBoxWrapper } from './tickBoxWrapper';

export const TickBox = ({ selected }: TickBoxProps) => (
	<TickBoxWrapper selected={selected}>
		<TickIcon label="tick" />
	</TickBoxWrapper>
);

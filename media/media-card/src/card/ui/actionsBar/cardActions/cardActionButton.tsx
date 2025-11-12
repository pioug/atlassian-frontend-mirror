import React, { forwardRef } from 'react';
import { type CardActionButtonOwnProps } from './styles';
import { CardActionButton as CompiledCardActionButton } from './cardActionButton-compiled';

export const CardActionButton = forwardRef<HTMLButtonElement, CardActionButtonOwnProps>(
	(props, ref) => <CompiledCardActionButton {...props} ref={ref} />,
);

import React, { forwardRef } from 'react';

import { CardActionButton as CompiledCardActionButton } from './cardActionButton-compiled';
import { type CardActionButtonOwnProps } from './styles';

export const CardActionButton: React.ForwardRefExoticComponent<
	CardActionButtonOwnProps & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, CardActionButtonOwnProps>((props, ref) => (
	<CompiledCardActionButton {...props} ref={ref} />
));

import { type ReactNode } from 'react';

import { type LozengeProps } from '../types';

export const isLozengeText = (
	lozengeProp: ReactNode | LozengeProps,
): lozengeProp is LozengeProps => {
	return lozengeProp?.hasOwnProperty('text') || false;
};

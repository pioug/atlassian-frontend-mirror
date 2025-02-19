import { type ReactElement } from 'react';

import { type SmartLinkSize } from '../../../../../../constants';
import { type ActionProps } from '../types';

export type ActionButtonProps = ActionProps & {
	iconAfter?: ReactElement;
	iconBefore?: ReactElement;
	isLoading?: boolean;
	size: SmartLinkSize;
	isDisabled?: boolean;
	href?: string;
	ariaLabel?: string;
};

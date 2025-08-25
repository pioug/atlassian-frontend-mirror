import { type ReactElement } from 'react';

import { type SmartLinkSize } from '../../../../../../constants';
import { type ActionProps } from '../types';

export type ActionButtonProps = ActionProps & {
	ariaLabel?: string;
	href?: string;
	iconAfter?: ReactElement;
	iconBefore?: ReactElement;
	isDisabled?: boolean;
	isLoading?: boolean;
	size: SmartLinkSize;
};

import type { ReactChild } from 'react';
import type { SmartLinkSize } from '../../../../../../constants';

export type ActionIconProps = {
	asStackItemIcon?: boolean;
	size?: SmartLinkSize;
	icon?: ReactChild;
	isDisabled?: boolean;
	testId?: string;
};

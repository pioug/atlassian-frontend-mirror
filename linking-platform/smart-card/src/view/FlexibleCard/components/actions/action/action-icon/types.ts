import type { ReactChild } from 'react';

import type { SmartLinkSize } from '../../../../../../constants';

export type ActionIconProps = {
	asStackItemIcon?: boolean;
	icon?: ReactChild;
	isDisabled?: boolean;
	size?: SmartLinkSize;
	testId?: string;
};

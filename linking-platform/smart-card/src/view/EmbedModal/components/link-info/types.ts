import type { RefObject } from 'react';

import { type IconProps } from '../../../common/Icon';

export type LinkInfoProps = {
	focusRef?: RefObject<HTMLHeadingElement>;
	icon?: IconProps;
	onDownloadButtonClick?: () => void;
	onResizeButtonClick?: () => void;
	onViewButtonClick?: () => void;
	providerName?: string;
	size?: string;
	testId?: string;
	title?: string;
};

import { type PropsWithChildren } from 'react';

import { type ContainerProps } from '../types';

export type HoverCardDelayProps = PropsWithChildren<
	Pick<ContainerProps, 'actionOptions' | 'hoverPreviewOptions'> & {
		isHoverPreview?: boolean;
		isAuthTooltip?: boolean;
		testId?: string;
		url: string;
		delay?: number;
	}
>;

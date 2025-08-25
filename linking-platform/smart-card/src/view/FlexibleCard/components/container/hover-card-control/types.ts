import { type PropsWithChildren } from 'react';

import { type ContainerProps } from '../types';

export type HoverCardDelayProps = PropsWithChildren<
	Pick<ContainerProps, 'actionOptions' | 'hoverPreviewOptions'> & {
		delay?: number;
		isAuthTooltip?: boolean;
		isHoverPreview?: boolean;
		testId?: string;
		url: string;
	}
>;

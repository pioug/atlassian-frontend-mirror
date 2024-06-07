import type { PropsWithChildren } from 'react';

export type MotionWrapperProps = PropsWithChildren<{
	isFadeIn?: boolean;
	minHeight?: number;
	show: boolean;
	showTransition?: boolean;
}>;

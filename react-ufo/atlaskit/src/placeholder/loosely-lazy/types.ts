import type { SuspenseProps } from 'react';

export type Fallback = SuspenseProps['fallback'];

export type LazySuspenseContextType = {
	fallback: Fallback;
	setFallback(fallback: Fallback): void;
	name?: string;
};

export type LazySuspenseProps = {
	children?: SuspenseProps['children'];
	fallback: Fallback;
	name?: string;
};

export type DynamicFallbackProps = {
	children(fallback: Fallback): any;
	outsideSuspense: boolean;
};

export type SubscriptionContextValue = {
	subscribe: (callback: () => void) => () => void;
	currentValue: () => number;
};

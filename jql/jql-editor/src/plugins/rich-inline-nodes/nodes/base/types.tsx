import { type ReactNode } from 'react';

export type NodeBaseProps = {
	iconBefore: ReactNode;
	isLocked?: boolean;
	text?: string;
};

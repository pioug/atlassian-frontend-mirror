import type React from 'react';

export type RegisterComponentParent = {
	key: string;
	rank: number;
	type: string;
};

export type RegisterComponent = {
	component?: (props: Record<string, unknown>) => React.ReactNode;
	isHidden?: () => boolean;
	key: string;
	parents?: RegisterComponentParent[];
	type: string;
};

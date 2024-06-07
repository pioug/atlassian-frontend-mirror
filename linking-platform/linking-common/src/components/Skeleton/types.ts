import type React from 'react';

export interface SkeletonProps {
	width?: number | string;
	height?: number | string;
	borderRadius?: number | string;
	appearance?: 'gray' | 'blue' | 'darkGray';
	isShimmering?: boolean;
	testId?: string;
	style?: React.CSSProperties;
}

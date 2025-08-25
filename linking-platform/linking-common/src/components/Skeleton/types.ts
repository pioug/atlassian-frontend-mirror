import type React from 'react';

export interface SkeletonProps {
	appearance?: 'gray' | 'blue' | 'darkGray';
	borderRadius?: number | string;
	height?: number | string;
	isShimmering?: boolean;
	style?: React.CSSProperties;
	testId?: string;
	width?: number | string;
}

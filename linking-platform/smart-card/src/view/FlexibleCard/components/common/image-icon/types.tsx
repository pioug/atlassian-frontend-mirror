export type ImageIconProps = {
	appearance?: 'square' | 'round';
	defaultIcon?: React.ReactNode;
	height?: string;
	hideLoadingSkeleton?: boolean;
	onError?: () => void;
	onLoad?: () => void;
	testId?: string;
	url: string;
	width?: string;
};

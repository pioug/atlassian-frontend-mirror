export type ImageIconProps = {
	defaultIcon?: React.ReactNode;
	testId?: string;
	url: string;
	width?: string;
	height?: string;
	onError?: () => void;
	onLoad?: () => void;
	appearance?: 'square' | 'round';
};

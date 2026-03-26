export type ImageIconProps = {
	appearance?: 'square' | 'round';
	defaultIcon?: React.ReactNode;
	height?: string;
	hideLoadingSkeleton?: boolean;
	/**
	 * Accessible name for the loaded image (maps to the HTML `alt` attribute).
	 */
	label?: string;
	onError?: () => void;
	onLoad?: () => void;
	testId?: string;
	url: string;
	width?: string;
};

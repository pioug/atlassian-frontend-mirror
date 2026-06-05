export const getBadgeSize = (width?: number, height?: number): 'medium' | 'small' => {
	// width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
	return (width && width < 70) || (height && height < 70) ? 'small' : 'medium';
};

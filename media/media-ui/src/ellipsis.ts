export const ellipsis = (maxWidth: string | number = '100%'): string => {
	const unit = typeof maxWidth === 'number' ? 'px' : '';

	return `
    max-width: ${maxWidth}${unit};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
};

export const size = (value: string | number = '100%'): string => {
	const unit = typeof value === 'number' ? 'px' : '';

	return `
    width: ${value}${unit};
    height: ${value}${unit};
  `;
};

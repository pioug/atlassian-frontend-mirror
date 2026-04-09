const typographyProperties = ['font-size', 'font-weight', 'font-family', 'line-height'];

export const isTypographyRule = (prop: string): boolean => {
	return typographyProperties.includes(prop);
};

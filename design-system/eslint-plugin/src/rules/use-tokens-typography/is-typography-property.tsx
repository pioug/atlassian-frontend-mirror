import { typographyProperties } from './typography-properties';

export const isTypographyProperty: (propertyName: string) => boolean = (
	propertyName: string,
): boolean => {
	return typographyProperties.includes(propertyName);
};

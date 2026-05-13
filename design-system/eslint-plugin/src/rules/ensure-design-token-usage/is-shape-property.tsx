import { isBorderSizeProperty } from './is-border-size-property';
import { isRadiusProperty } from './is-radius-property';

export function isShapeProperty(propertyName: string): boolean {
	return isRadiusProperty(propertyName) || isBorderSizeProperty(propertyName);
}

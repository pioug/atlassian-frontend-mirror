const shapeProperties = [
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderBottomRightRadius',
	'borderBottomLeftRadius',
	'borderRadius',
	'borderStartStartRadius',
	'borderStartEndRadius',
	'borderEndStartRadius',
	'borderEndEndRadius',
];

const borderSizeProperties = [
	'borderWidth',
	'outlineWidth',
	'borderRightWidth',
	'borderLeftWidth',
	'borderTopWidth',
	'borderBottomWidth',
	'borderInlineWidth',
	'borderBlockWidth',
];

export function isRadiusProperty(propertyName: string): boolean {
	return shapeProperties.includes(propertyName);
}

export function isBorderSizeProperty(propertyName: string): boolean {
	return borderSizeProperties.includes(propertyName);
}

export function isShapeProperty(propertyName: string): boolean {
	return isRadiusProperty(propertyName) || isBorderSizeProperty(propertyName);
}

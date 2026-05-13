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

export function isBorderSizeProperty(propertyName: string): boolean {
	return borderSizeProperties.includes(propertyName);
}

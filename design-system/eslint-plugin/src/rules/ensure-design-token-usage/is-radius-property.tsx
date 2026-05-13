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

export function isRadiusProperty(propertyName: string): boolean {
	return shapeProperties.includes(propertyName);
}

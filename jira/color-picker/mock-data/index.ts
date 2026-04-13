export const simplePalette: {
	label: string;
	value: string;
}[] = [
	{
		label: 'Purple',
		value: '#8777D9',
	},
	{
		label: 'Blue',
		value: '#2684FF',
	},
	{
		label: 'Green',
		value: '#57D9A3',
	},
	{
		label: 'Teal',
		value: '#00C7E6',
	},
	{
		label: 'Yellow',
		value: '#FFC400',
	},
	{
		label: 'Red',
		value: '#FF7452',
	},
];

export const extendedPalette: {
	label: string;
	value: string;
}[] = (
	simplePalette as {
		label: string;
		value: string;
	}[]
).concat([
	{
		label: 'Dark Purple',
		value: '#5243AA',
	},
	{
		label: 'Dark Blue',
		value: '#0052CC',
	},
	{
		label: 'Dark Green',
		value: '#00875A',
	},
	{
		label: 'Dark Teal',
		value: '#00A3BF',
	},
	{
		label: 'Dark Yellow',
		value: '#FF991F',
	},
	{
		label: 'Dark Red',
		value: '#DE350B',
	},
]);

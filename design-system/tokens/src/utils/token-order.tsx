/**
 * Create specific rules for ordering tokens based on their root path and subpath.
 */
export const tokenOrder: {
	path: string;
	subpaths: string[];
}[] = [
	{
		path: 'color',
		subpaths: [
			'background',
			'border',
			'text',
			'icon',
			'link',
			'interaction',
			'skeleton',
			'blanket',
			'chart',
			'rovo',
			// deleted ↓
			'accent',
			'iconBorder',
			'overlay',
		],
	},
	{
		path: 'elevation',
		subpaths: ['surface', 'rovo', 'shadow'],
	},
	{
		path: 'opacity',
		subpaths: [],
	},
	{ path: 'shadow', subpaths: ['card', 'overlay'] }, // Deleted
	{
		path: 'utility',
		subpaths: [],
	},
	{
		path: 'space',
		subpaths: [],
	},
	{
		path: 'font',
		subpaths: ['heading', 'body', 'metric', 'code', 'weight', 'family', 'size', 'lineHeight'],
	},
	{
		path: 'radius',
		subpaths: [],
	},
	{
		path: 'border',
		subpaths: ['radius', 'width'],
	},
	{
		path: 'value', // Legacy palette
		subpaths: [],
	},
];

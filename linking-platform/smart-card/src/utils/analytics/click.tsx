export const buttonMap: Map<number | undefined, 'middle' | 'none' | 'left' | 'right'> = new Map<
	number | undefined,
	'none' | 'left' | 'middle' | 'right'
>([
	[undefined, 'none'],
	[0, 'left'],
	[1, 'middle'],
	[2, 'right'],
]);

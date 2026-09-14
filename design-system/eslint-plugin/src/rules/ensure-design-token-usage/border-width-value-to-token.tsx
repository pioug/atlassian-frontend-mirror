import shapeTokens from '@atlaskit/tokens/atlassian-shape';

export const borderWidthValueToToken: any = Object.fromEntries(
	shapeTokens
		.filter((t) => t.name.startsWith('border.width'))
		.map((t) => [t.value, t.cleanName])
		.concat([['2px', 'border.width']]),
);

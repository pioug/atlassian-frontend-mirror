import shapeTokens from '@atlaskit/tokens/atlassian-shape';

export const radiusValueToToken: any = Object.fromEntries(
	shapeTokens
		.filter((t) => t.name.startsWith('radius'))
		.map((t) => {
			return [t.value, t.cleanName];
		})
		// add in extra entries to resolve 3px, 50%, and 100% to tokens
		.concat([
			['3px', 'radius.small'],
			['50%', 'radius.full'],
			['100%', 'radius.full'],
		]),
);

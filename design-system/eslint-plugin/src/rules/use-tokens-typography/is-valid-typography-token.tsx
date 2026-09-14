import typographyTokens from '@atlaskit/tokens/atlassian-typography';

export function isValidTypographyToken(tokenName: string):
	| {
			value: string;
			filePath: string;
			isSource: boolean;
			attributes: {
				group: string;
				state: string;
				introduced: string;
				description: string;
				suggest?: string[];
				deprecated?: string;
				replacement?: string;
			};
			original: {
				value:
					| string
					| {
							fontWeight: string;
							fontSize: string;
							lineHeight: string;
							fontFamily: string;
							fontStyle: string;
							letterSpacing: string;
					  };
				attributes: {
					group: string;
					state: string;
					introduced: string;
					description: string;
					suggest?: string[];
					deprecated?: string;
					replacement?: string;
				};
			};
			name: string;
			path: string[];
			cleanName: string;
	  }
	| undefined {
	return typographyTokens
		.filter((t) => t.attributes.group === 'typography')
		.filter(
			(t) =>
				t.cleanName.includes('font.heading') ||
				t.cleanName.includes('font.body') ||
				t.cleanName.includes('font.code'),
		)
		.find((t) => t.cleanName === tokenName);
}

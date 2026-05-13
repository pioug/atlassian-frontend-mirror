/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { atlaskitComponents } from './atlaskit-components.codegen';

export const getAtlaskitComponentsTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const components = atlaskitComponents.map((component) => ({
		name: component.name,
		package: component.package,
	}));

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(components, null, 2),
			},
		],
	};
};

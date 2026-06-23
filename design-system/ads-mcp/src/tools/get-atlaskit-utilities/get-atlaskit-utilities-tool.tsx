/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { atlaskitUtilities } from './atlaskit-utilities.codegen';

export const getAtlaskitUtilitiesTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const utilities = atlaskitUtilities.map((utility) => ({
		name: utility.name,
		package: utility.package,
	}));

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(utilities, null, 2),
			},
		],
	};
};

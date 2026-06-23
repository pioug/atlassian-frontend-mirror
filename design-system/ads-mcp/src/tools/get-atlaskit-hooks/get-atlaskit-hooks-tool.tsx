/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { atlaskitHooks } from './atlaskit-hooks.codegen';

export const getAtlaskitHooksTool = async (): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const hooks = atlaskitHooks.map((hook) => ({
		name: hook.name,
		package: hook.package,
	}));

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(hooks, null, 2),
			},
		],
	};
};

/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { icons } from './icons';

export const getAllIconsTool = async (): Promise<{
	content: {
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: string;
		text: string;
	}[];
}> => ({
	content: icons.map((icon) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: 'text',
		text: JSON.stringify(icon, null, 2),
	})),
});

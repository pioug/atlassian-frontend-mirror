/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { loadAllComponents } from './load-all-components';

export const getAllComponentsTool = async (): Promise<{
	content: {
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: component`
		type: string;
		text: string;
	}[];
}> => {
	return {
		content: loadAllComponents().map((component) => ({
			// NOTE: Ideally one day the MCP would support structured content…
			// eg. `type: 'object', data: component`
			type: 'text',
			text: JSON.stringify(component, null, 2),
		})),
	};
};

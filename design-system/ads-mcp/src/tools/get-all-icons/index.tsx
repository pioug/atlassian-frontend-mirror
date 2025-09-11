import { coreIconMetadata } from '@atlaskit/icon/metadata';

import { emptyInputSchema } from '../../schema';

const icons = Object.entries(coreIconMetadata).map(([_key, icon]) => ({
	componentName: icon.componentName,
	package: icon.package,
	categorization: icon.categorization,
	keywords: icon.keywords,
	status: icon.status,
	usage: icon.usage,
	type: icon.type,
	shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
}));

export const listGetAllIconsTool = {
	name: 'get_all_icons',
	description: `You SHOULD call this when you need complete guidance on what icons to use, but you SHOULD use the \`search_icons\` tool to find specific icons instead.
These are the only icons to be used in modern code, though other legacy icons may still be found, these are not to be used by you, but you can keep them if you see them in existing code.
The resulting icon name and package is often like this:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';

// Usage in isolation
<AddIcon label="Add" />

// Usage with a button
import Button from '@atlaskit/button/new';
<Button iconAfter={AddIcon}>Create</Button>
\`\`\`
`,
	annotations: {
		title: 'Get ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: emptyInputSchema,
};

export const getAllIconsTool = async () => ({
	content: icons.map((icon) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: 'text',
		text: JSON.stringify(icon, null, 2),
	})),
});

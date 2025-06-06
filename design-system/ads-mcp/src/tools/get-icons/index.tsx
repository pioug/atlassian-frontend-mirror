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

export const listGetIconsTool = {
	name: 'get_icons',
	description: `You MUST use this to fetch all Atlassian Design System icons and parse their names, package, and understand how they're used (provided in JSON format) before working with iconography.
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

export const getIconsTool = async () => ({
	content: icons.map((icon) => ({
		// NOTE: Ideally one day the MCP would support structured content…
		// eg. `type: 'object', data: icon`
		type: 'text',
		text: JSON.stringify(icon, null, 2),
	})),
});

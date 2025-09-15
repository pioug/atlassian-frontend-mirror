import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { cleanQuery } from '../../helpers';
import { components } from '../get-components/components';

const inputSchema = z.object({
	terms: z
		.array(z.string())
		.describe('Search term(s) to find components by name, package name, description, or example'),
	limit: z
		.number()
		.optional()
		.default(1)
		.describe('Maximum number of results per term to return (default: 1)'),
	exactName: z
		.boolean()
		.optional()
		.default(false)
		.describe('Whether to search for exact match only for the component name'),
});

type Component = (typeof components)[number];

export const listSearchComponentsTool = {
	name: 'search_components',
	description: `You SHOULD use this to search for Atlassian Design System components based on multiple query strings (if there are multiple candidates of component names, descriptions, categories, or package names, you SHOULD pass them in a single call). You SHOULD use default \`limit\` value of 1 first and only set a higher limit like 5 or 10 if you can't find the component you need. Fallback to \`get_components\` if nothing is found. This tool searches through component names, descriptions, categories, and package names to find the most relevant design system components.

The search will match against:
- Component names (e.g., "Button", "TextField", "Avatar")
- Package names (e.g., "@atlaskit/button", "@atlaskit/textfield")
- Component descriptions (descriptive text about what the component does)
- Component categories (e.g., "Forms and Input", "Navigation", "Data Display")

The results include the component's name, package name, example, and props.

Usage pattern for found components:
\`\`\`tsx
import Button from '@atlaskit/button/new';
import CopyIcon from '@atlaskit/icon/core/copy';

<Button appearance="primary" iconBefore={CopyIcon}>Copy text</Button>
\`\`\`
`,
	annotations: {
		title: 'Search ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

// Clean component result to only return name, package name, example, and props
const cleanComponentResult = (result: Component) => {
	return {
		name: result.name,
		packageName: result.packageName,
		example: result.example,
		props: result.props,
	};
};

export const searchComponentsTool = async (params: z.infer<typeof inputSchema>): Promise<CallToolResult> => {
	const { terms, limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);

	if (!searchTerms.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: Required parameter 'terms' is missing or empty`,
				},
			],
		};
	}

	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches = searchTerms
			.map((term) => {
				return components.find((component) => component.name.toLowerCase() === term.toLowerCase());
			})
			.filter(Boolean) as Component[];

		if (exactNameMatches.length > 0) {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(exactNameMatches.map(cleanComponentResult)),
					},
				],
			};
		}
	}

	// use Fuse.js to fuzzy-search through the components
	const fuse = new Fuse(components, {
		keys: [
			{
				name: 'name',
				weight: 3,
			},
			{
				name: 'packageName',
				weight: 3,
			},
			{
				name: 'category',
				weight: 2,
			},
			{
				name: 'description',
				weight: 2,
			},
			{
				name: 'example',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	// every search term, search for the results
	const results = searchTerms
		.map((term) => {
			// always search exact match from the components first
			const exactNameMatch = components.find(
				(component) => component.name.toLowerCase() === term.toLowerCase(),
			);
			if (exactNameMatch) {
				return [
					{
						item: exactNameMatch,
					},
				];
			}

			return fuse.search(term).slice(0, limit);
		})
		.flat();

	if (!results.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: No components found for '${terms.join(', ')}'. Available components: ${components.map((c) => c.name).join(', ')}`,
				},
			],
		};
	}

	// Remove duplicates based on component name
	const uniqueResults = results.filter((result, index, arr) => {
		return arr.findIndex(r => r.item.name === result.item.name) === index;
	});

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(uniqueResults.map((result) => result.item).map(cleanComponentResult)),
			},
		],
	};
};

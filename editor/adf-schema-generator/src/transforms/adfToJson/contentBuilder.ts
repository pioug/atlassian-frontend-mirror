import uniqBy from 'lodash/uniqBy';
import type { JSONSchema4 } from 'json-schema';
import { ADFNode } from '../../adfNode';
import type { ADFNodeGroup } from '../../types/ADFNodeGroup';
import type { ADFNodeContentSpec, ADFNodeSpec } from '../../types/ADFNodeSpec';
import { JSONSchemaTransformerName } from '../transformerNames';
import type { ContentVisitorReturnType } from './adfToJsonVisitor';
import { resolveName } from './nameResolver';

export function buildContent(
	content: Array<ContentVisitorReturnType>,
	name: string,
	nodeSpec: ADFNodeSpec,
	fullSchema: boolean,
): JSONSchema4 {
	if (content.length === 0) {
		return {};
	}

	const adfNodeContent = nodeSpec.content || [];

	const minItems = nodeSpec.contentMinItems ?? determineMinItems(content);
	const items = determineItems(content, name, adfNodeContent, fullSchema);
	const maxItems = nodeSpec.contentMaxItems ?? determineMaxItems(content);

	return {
		content: {
			type: 'array',
			items,
			...(minItems !== null ? { minItems } : {}),
			...(maxItems !== null ? { maxItems } : {}),
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isADFGroup(value: ADFNode<any> | ADFNodeGroup): value is ADFNodeGroup {
	return value && 'group' in value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isADFNode(value: ADFNode<any> | ADFNodeGroup): value is ADFNode {
	return value && value instanceof ADFNode;
}

export function determineItems(
	content: Array<ContentVisitorReturnType>,
	name: string,
	adfNodeContent: Array<ADFNodeContentSpec>,
	fullSchema: boolean,
): JSONSchema4 | (JSONSchema4 | undefined)[] | undefined {
	// @DSLCompatibilityException Special case for doc_node.
	// It flattens the groups using the nodes themselves instead of the group name in the content.
	if (name === 'doc') {
		const jsonSchema: JSONSchema4[] = adfNodeContent.reduce((acc, value) => {
			// We're expecting a single one+ with a nested $or
			if (value.type === '$one+' && value.content.type === '$or') {
				return [
					...acc,
					...flattenContent(value.content.content)
						.filter((node) => {
							return (
								!node.isIgnored(JSONSchemaTransformerName) && !(node.isStage0Only() && fullSchema)
							);
						})
						.map((node) => ({
							$ref: `#/definitions/${resolveName(node.getName())}`,
						})),
				];
			}
			return acc;
		}, [] as JSONSchema4[]);

		const anyOfItems = uniqBy(jsonSchema, (v) => v.$ref);

		if (!anyOfItems.length) {
			return;
		}

		return {
			anyOf: anyOfItems,
		};
	}

	const processedContentGroups = processContentGroups(content);
	// The JSON schema omits the array if there is only 1 item
	return flattenArray(processedContentGroups);
}

export function processContentTypes(contentTypes: string[]): JSONSchema4 | undefined {
	const itemsArray: JSONSchema4[] = [];
	contentTypes.forEach((piece) => {
		itemsArray.push({ $ref: `#/definitions/${resolveName(piece)}` });
	});

	if (itemsArray.length === 0) {
		return;
	}

	// We flatten an array here as well, but using anyOf to fit the JSON schema
	if (itemsArray.length === 1) {
		return itemsArray[0];
	} else {
		return { anyOf: itemsArray };
	}
}

export function processContentGroups(content: Array<ContentVisitorReturnType>): (JSONSchema4 | undefined)[] {
	return content.map((item) => processContentTypes(item.contentTypes)).filter(Boolean);
}

export function determineMinItems(content: Array<ContentVisitorReturnType>): number | null {
	// Despite it being possible for there to be multiple content groups on one node in DSL,
	// the JSON schema has only one minItem value for all content on a node.
	if (!content) {
		return null;
	}
	const { minItems } = content.find((v) => v.minItems !== undefined && !isNaN(v.minItems)) ?? {};
	const { range } = content.find((v) => v.range) ?? {};

	if (minItems) {
		return minItems;
	}

	// If it's a range, take minItems from that
	if (range) {
		return range.min;
	}

	return null;
}

// This function is not comprehensive, it is only defined for certain inputs
export function determineMaxItems(content: Array<ContentVisitorReturnType>): number | null {
	// Despite it being possible for there to be multiple content groups on one node in DSL,
	// the JSON schema has only one maxItem value for all content on a node.

	// If there's only one item, we can simply calculate it and return
	if (content.length === 1) {
		// If it's a range, grab maxItems from that
		if (content[0].range) {
			return content[0].range.max;
		}

		return null;
	}

	let maxItems = 0;

	for (const item of content) {
		// ignoring empty content items, e.g. when all nodes in this particular content items
		// are filtered out by being ignored for json-schema output
		if (!item.contentTypes.length) {
			continue;
		}

		if (item.type === '$or') {
			maxItems += 1;
		} else if (item.type === '$zeroPlus' || item.type === '$onePlus') {
			// with zeroPlus and onePlus it means parent can have infinite number of children
			return null;
		} else if (item.type === '$range' && item.range) {
			maxItems += item.range.max;
		}
	}

	return maxItems > 0 ? maxItems : null;
}

export function flattenArray<T>(array: Array<T>): T | T[] {
	if (array.length === 1) {
		return array[0];
	} else {
		return array;
	}
}
/**
 * Flattens ADF groups and nodes into an array of nodes.
 * @param content
 * @returns ADFNode[]
 */
export function flattenContent(content: (ADFNodeGroup | ADFNode)[]): ADFNode[] {
	return content.reduce((acc, item) => {
		if (isADFGroup(item)) {
			// Expand the group into its member nodes
			return [...acc, ...flattenContent(item.members)];
		} else if (isADFNode(item) && !item.isIgnored(JSONSchemaTransformerName)) {
			return [...acc, item];
		}
		return acc;
	}, [] as ADFNode[]);
}

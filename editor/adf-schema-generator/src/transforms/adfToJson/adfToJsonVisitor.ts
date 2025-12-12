import type { JSONSchema4 } from 'json-schema';
import type { ADFNode } from '../../adfNode';
import type { ADFVisitor } from '../../traverse';
import type { ADFNodeContentRangeSpec, ADFNodeSpec } from '../../types/ADFNodeSpec';
import { JSONSchemaTransformerName } from '../transformerNames';
import { resolveName } from './nameResolver';
import { buildMarks } from './marksBuilder';

// Lots of placeholder code for now
export type NodeVisitorReturnType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json: Record<string, any>;
	node: ADFNode<[string], ADFNodeSpec>;
};

export type GroupVisitorReturnType = {
	group: string;
	members: Array<NodeVisitorReturnType>;
};

export type ContentVisitorReturnType = {
	contentTypes: string[];
	minItems?: 1 | 0;
	range?: ADFNodeContentRangeSpec;
	type: '$or' | '$range' | '$zeroPlus' | '$onePlus';
};

export function isNodeReturnValue(
	value: NodeVisitorReturnType | GroupVisitorReturnType,
): value is NodeVisitorReturnType {
	return value && 'node' in value;
}

export function isGroupReturnValue(
	value: NodeVisitorReturnType | GroupVisitorReturnType,
): value is GroupVisitorReturnType {
	return value && 'group' in value;
}

export const buildVisitor = (
	res: Record<string, { json: JSONSchema4 }>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	buildJson: (node: ADFNode<any, any>, content: any, fullSchema: boolean) => Record<string, any>,
	fullSchema: boolean,
): ADFVisitor<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType> => {
	return {
		node: (node, content, cycle) => {
			if (node.isStage0Only() && fullSchema) {
				return undefined as unknown as NodeVisitorReturnType;
			}

			if (node.isIgnored(JSONSchemaTransformerName)) {
				return undefined as unknown as NodeVisitorReturnType;
			}

			const json = buildJson(node, content, fullSchema);
			const processedNode: NodeVisitorReturnType = {
				node,
				json,
			};

			if (cycle) {
				return processedNode;
			}

			res[resolveName(node.getName())] = { json };

			const marks = buildMarks(node.getSpec().marks ?? []);
			Object.entries(marks).forEach(([key, value]) => {
				res[key] = value;
			});

			return processedNode;
		},
		group: (group, members) => {
			if (group.isIgnored(JSONSchemaTransformerName)) {
				return undefined as unknown as GroupVisitorReturnType;
			}
			res[resolveName(group.group)] = {
				json: {
					anyOf: group.members
						.filter(
							(m) => !m.isIgnored(JSONSchemaTransformerName) && !(m.isStage0Only() && fullSchema),
						)
						.map((m) => ({
							$ref: `#/definitions/${resolveName(m.getName())}`,
						})),
				},
			};
			return { group: group.group, members };
		},
		$or(children) {
			const contentTypes: string[] = [];

			for (const child of children) {
				if (isGroupReturnValue(child)) {
					// only include content types if group has members
					// e.g. blockRootOnly don't have members, so won't be included in contentTypes of doc
					if (child.members && child.members.length > 0) {
						contentTypes.push(child.group);
					}
				} else if (isNodeReturnValue(child)) {
					contentTypes.push(child.node.getName());
				}
			}

			return {
				type: '$or',
				minItems: 1,
				contentTypes,
			};
		},
		$onePlus(child) {
			return {
				type: '$onePlus',
				minItems: 1,
				contentTypes: child.contentTypes,
			};
		},
		$zeroPlus(child) {
			return {
				type: '$zeroPlus',
				minItems: 0,
				contentTypes: child.contentTypes,
			};
		},
		$range(range, child) {
			return {
				type: '$range',
				contentTypes: child.contentTypes,
				range,
			};
		},
	};
};

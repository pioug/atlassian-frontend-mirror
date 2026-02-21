import type { ADFNode } from '../../adfNode';
import { traverse } from '../../traverse';
import { pmNodeGroupsCodeGen } from './pmNodeGroupsCodeGen';
import { pmNodesCodeGen } from './pmNodesCodeGen';
import { pmMarksCodeGen } from './pmMarksCodeGen';
import { buildMarkSpec, buildNodeSpec } from './buildPmSpec';
import { buildContentExpression } from './buildContentExpression';
import { buildNodeTypeDefinition } from './buildPmNodeTypes';
import type {
	ContentVisitorReturnType,
	GroupVisitorReturnType,
	MarkSpecResMap,
	NodeSpecResMap,
	NodeVisitorReturnType,
} from './types';
import { PMSpecTransformerName } from '../transformerNames';
import { PSEUDO_GROUPS } from './pseudoGroups';
import type { ADFMark } from '../../adfMark';
import { getNodeNames } from './getNodeNames';

function isNodeReturnValue(
	value: NodeVisitorReturnType | GroupVisitorReturnType,
): value is NodeVisitorReturnType {
	return value && 'node' in value;
}

function isGroupReturnValue(
	value: NodeVisitorReturnType | GroupVisitorReturnType,
): value is GroupVisitorReturnType {
	return value && 'group' in value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transform(adf: ADFNode<any, any>): {
	markResMap: Record<string, MarkSpecResMap>;
	nodeGroupMap: Record<string, string[]>;
	nodeResMap: Record<string, NodeSpecResMap>;
} {
	const nodeResMap: Record<string, NodeSpecResMap> = {};
	const markResMap: Record<string, MarkSpecResMap> = {};
	const nodeGroupMap: Record<string, string[]> = {};
	const ignoredGroups = new Set<string>(Array.from(PSEUDO_GROUPS));

	traverse<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType>(adf, {
		node: (node, content, cycle) => {
			if (node.isIgnored(PMSpecTransformerName)) {
				return undefined as unknown as NodeVisitorReturnType;
			}

			function processNode(node: ADFNode, stage0: boolean = false) {
				const nodeName = node.getName(stage0);
				const nodeSpec = node.getSpec(stage0);
				const marks = node.getMarks(stage0);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				marks.forEach((mark: ADFMark<any>) => {
					if (!markResMap[mark.getType()]) {
						markResMap[mark.getType()] = {
							mark,
							pmMarkSpec: buildMarkSpec(mark),
						};
					}
				});

				if (!cycle) {
					nodeResMap[nodeName] = {
						pmNodeSpec: buildNodeSpec(node.getType(), nodeSpec, node.getGroups(), content),
						nodeTypeDefinition: buildNodeTypeDefinition(
							nodeSpec,
							node.getType(),
							nodeSpec.marks?.map((m) => m.getType()) ?? [],
							content,
						),
					};
				}
			}

			if (node.isStage0Only()) {
				// Entire node is stage0
				processNode(node, true);
			} else {
				// Partial override of node spec in stage0
				if (node.hasStage0()) {
					processNode(node, true);
				}

				// In case of partial override, need to generate node spec for base node as well
				processNode(node);
			}

			return { node };
		},
		group: (group, members) => {
			if (group.isIgnored(PMSpecTransformerName)) {
				ignoredGroups.add(group.group);
				return undefined as unknown as GroupVisitorReturnType;
			}

			nodeGroupMap[group.group] = group.members
				.filter((node) => !node.isIgnored(PMSpecTransformerName))
				.flatMap((node) => getNodeNames(node));

			return {
				group: group.group,
				members: members.filter((m) => m && !m.node.isIgnored(PMSpecTransformerName)),
			};
		},
		$or(children) {
			const expr: Array<string> = [];
			const marks = new Set<string>();
			const contentTypes: Array<string> = [];

			for (const child of children) {
				if (isGroupReturnValue(child)) {
					/**
					 * Flatten pseudo groups
					 */
					if (PSEUDO_GROUPS.has(child.group)) {
						for (const member of child.members) {
							expr.push(member.node.getType());
							contentTypes.push(...getNodeNames(member.node));
						}
					} else {
						expr.push(child.group);
					}
					// only include content types if group has members
					// e.g. blockRootOnly don't have members, so won't be included in contentTypes of doc
					if (child.members && child.members.length > 0 && !PSEUDO_GROUPS.has(child.group)) {
						contentTypes.push(child.group);
					}

					for (const member of child.members) {
						for (const mark of member.node.getMarksTypes()) {
							marks.add(mark);
						}

						if (member.node.hasStage0()) {
							for (const mark of member.node.getMarksTypes(true)) {
								marks.add(mark);
							}
						}
					}
				} else if (isNodeReturnValue(child)) {
					expr.push(child.node.getType());
					contentTypes.push(...getNodeNames(child.node));
					if (child.node.getMarks().length) {
						for (const mark of child.node.getMarksTypes()) {
							marks.add(mark);
						}
					}

					if (child.node.hasStage0()) {
						for (const mark of child.node.getMarksTypes(true)) {
							marks.add(mark);
						}
					}
				}
			}

			return {
				expr,
				marks: Array.from(marks),
				contentTypes,
			};
		},
		$onePlus(child) {
			return {
				// PM Spec does not have concept of variants, so we will have duplicate content types
				expr: [buildContentExpression(Array.from(new Set(child.expr)), '+')],
				marks: child.marks,
				contentTypes: child.contentTypes,
			};
		},
		$zeroPlus(child) {
			return {
				// PM Spec does not have concept of variants, so we will have duplicate content types
				expr: [buildContentExpression(Array.from(new Set(child.expr)), '*')],
				marks: child.marks,
				contentTypes: child.contentTypes,
			};
		},
		$range(item, child) {
			return {
				// PM Spec does not have concept of variants, so we will have duplicate content types
				expr: [
					buildContentExpression(Array.from(new Set(child.expr)), `{${item.min},${item.max}}`),
				],
				marks: child.marks,
				contentTypes: child.contentTypes,
			};
		},
	});

	/**
	 * Remove ignored groups from nodeSpecRes.
	 */
	for (const nodeSpecRes of Object.values(nodeResMap)) {
		if (!nodeSpecRes.pmNodeSpec.group) {
			continue;
		}
		nodeSpecRes.pmNodeSpec.group = (nodeSpecRes.pmNodeSpec.group.split(' ') ?? [])
			.filter((group: string) => !ignoredGroups.has(group))
			.join(' ');

		if (!nodeSpecRes.pmNodeSpec.group) {
			delete nodeSpecRes.pmNodeSpec.group;
		}
	}

	return {
		nodeGroupMap,
		markResMap,
		nodeResMap,
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adfToPm(adfNode: ADFNode<any>):
	| {
			pmMarks: string;
			pmNodeGroups: string;
			pmNodes: string;
	  }
	| undefined {
	try {
		const { nodeGroupMap, markResMap, nodeResMap } = transform(adfNode);
		return {
			pmNodeGroups: pmNodeGroupsCodeGen(nodeGroupMap),
			pmMarks: pmMarksCodeGen(markResMap),
			pmNodes: pmNodesCodeGen(nodeResMap),
		};
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
	}
}

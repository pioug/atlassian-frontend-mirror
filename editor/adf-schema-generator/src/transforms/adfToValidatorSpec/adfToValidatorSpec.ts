import type { ADFMark } from '../../adfMark';
import type { ADFNode } from '../../adfNode';

import unset from 'lodash/unset';
import set from 'lodash/set';
import has from 'lodash/has';

import type { ADFVisitor } from '../../traverse';
import { traverse } from '../../traverse';
import type { ADFNodeSpec } from '../../types/ADFNodeSpec';
import { ValidatorSpecTransformerName } from '../transformerNames';
import { buildAttrs } from './buildAttrs';
import { buildContent } from './buildContent';
import { buildMarks } from './buildMarks';
import type { ValidatorSpec, ValidatorSpecMark, ValidatorSpecNode } from './ValidatorSpec';
import type { ValidatorSpecResult } from './ValidatorSpecResult';

export type NodeVisitorReturnType = {
	json: ValidatorSpec;
	node: ADFNode<[string], ADFNodeSpec>;
};

export type GroupVisitorReturnType = {
	group: string;
	members: Array<NodeVisitorReturnType>;
};

export type ContentVisitorReturnType = {
	contentTypes: Array<string>;
	hasUnsupportedBlock?: boolean;
	hasUnsupportedInline?: boolean;
	marks: Array<string>;
	maxItems?: number;
	minItems?: number;
	optional?: boolean;
};

export type MarksVisitorReturnType = {
	items: Array<string>;
	optional?: boolean;
	type: string;
};

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

function transform(adf: ADFNode<[string], ADFNodeSpec>): ValidatorSpecResult {
	const result: ValidatorSpecResult = {};

	traverse(adf, buildVisitor(result, buildNode));

	const formattedResult: ValidatorSpecResult = {};
	Object.entries(result)
		.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
		.forEach(([key, value]) => {
			formattedResult[key] = value;
		});

	return formattedResult;
}

export function adfToValidatorSpec(adf: ADFNode<[string], ADFNodeSpec>): ValidatorSpecResult {
	return transform(adf);
}

export const buildNode = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	content: Array<ContentVisitorReturnType>,
): ValidatorSpec => {
	const json: ValidatorSpecNode = { props: {} };
	const base = node.getBase();
	const isBaseVariant = !base;
	const baseSpec = base?.getSpec() ?? {};
	const nodeSpec = node.getSpec(node.hasStage0());
	const nodeType = node.getType();

	// Only base variant has type
	if (isBaseVariant) {
		json.props.type = { type: 'enum', values: [nodeType] };
	}

	if (
		nodeSpec.attrs !== baseSpec.attrs &&
		nodeSpec.attrs &&
		Object.keys(nodeSpec.attrs).length > 0
	) {
		json.props.attrs = buildAttrs(nodeSpec.attrs);
		if (nodeSpec.attrs.anyOf) {
			json.required = ['attrs'];
		}
	}

	// Text is a special node in PM and it has a text property
	if (node.getName() === 'text') {
		json.props.text = { type: 'string', minLength: 1 };
	}

	if (nodeSpec.version) {
		json.props.version = {
			type: 'enum',
			values: [nodeSpec.version],
		};
	}

	if (content.length && nodeSpec.content !== baseSpec.content) {
		json.props.content = buildContent(node, content);
	}

	if (nodeSpec.marks !== baseSpec.marks) {
		const marks = buildMarks(nodeSpec.marks ?? [], nodeSpec.noMarks, nodeSpec.hasEmptyMarks);
		if (marks) {
			json.props.marks = marks;
		}
	}

	const overrides = node.getSpec().DANGEROUS_MANUAL_OVERRIDE?.['validator-spec'] || {};
	for (const [key, override] of Object.entries(overrides)) {
		if (override.remove) {
			if (!has(json, key)) {
				throw new Error(`Cannot delete non-existing property: ${key} for node ${node.getName()}`);
			}
			unset(json, key);
		} else {
			set(json, key, override.value);
		}
	}

	const customJson = applyCompatibilityExceptions(node, json, content);
	if (customJson) {
		return customJson;
	}

	// In validator spec if it's not a base variant,
	// the spec extends the base variant.
	// Which is represented as ['base_variant_name', {...variant_specific_spec}]
	if (!isBaseVariant) {
		return [base.getName(), json];
	}

	return json;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildMarkValidatorSpec = (mark: ADFMark<any>): ValidatorSpecMark => {
	const json: ValidatorSpecMark = { props: {} };
	const markSpec = mark.getSpec();

	json.props = {
		type: {
			type: 'enum',
			values: [mark.getType()],
		},
	};

	if (markSpec?.attrs && Object.keys(markSpec.attrs).length > 0) {
		json.props.attrs = buildAttrs(markSpec.attrs);
	}

	return json;
};

const buildVisitor = (
	res: ValidatorSpecResult,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	buildNode: (node: ADFNode<any>, content: Array<ContentVisitorReturnType>) => ValidatorSpec,
): ADFVisitor<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType> => {
	return {
		node: (node, content, cycle) => {
			if (node.getType() === 'doc') {
				rewriteDocNodeContent(content);
			}

			const processedNode: NodeVisitorReturnType = {
				node,
				json: buildNode(
					node,
					content.filter((item) => item.contentTypes.length),
				),
			};
			if (cycle) {
				return processedNode;
			}

			if (!node.isIgnored(ValidatorSpecTransformerName)) {
				res[node.getName()] = processedNode;
			}

			return processedNode;
		},
		group: (group, members) => {
			if (group.isIgnored(ValidatorSpecTransformerName)) {
				return undefined as unknown as GroupVisitorReturnType;
			}

			const groupName = group.group;

			res[groupName] = {
				json: group.members
					.filter((member) => !member.isIgnored(ValidatorSpecTransformerName))
					.map((member) => member.getName()),
			};

			return {
				group: groupName,
				members: members,
			};
		},
		$onePlus(child) {
			return {
				contentTypes: child.contentTypes,
				marks: child.marks,
				minItems: 1,
				hasUnsupportedBlock: child.hasUnsupportedBlock,
				hasUnsupportedInline: child.hasUnsupportedInline,
			};
		},
		$zeroPlus(child) {
			return {
				contentTypes: child.contentTypes,
				marks: child.marks,
				minItems: 0,
				optional: true,
				hasUnsupportedBlock: child.hasUnsupportedBlock,
				hasUnsupportedInline: child.hasUnsupportedInline,
			};
		},
		$range(item, child) {
			return {
				contentTypes: child.contentTypes,
				marks: child.marks,
				minItems: item.min,
				maxItems: item.max,
				hasUnsupportedBlock: child.hasUnsupportedBlock,
				hasUnsupportedInline: child.hasUnsupportedInline,
			};
		},
		$or(children) {
			const marks = new Set<string>();
			const contentTypes: Array<string> = [];
			let hasUnsupportedInline = false;
			let hasUnsupportedBlock = false;
			const hasNodes = children.some((item) => {
				if (isNodeReturnValue(item)) {
					return !item.node.isIgnored(ValidatorSpecTransformerName);
				}
				return false;
			});

			for (const child of children) {
				if (isGroupReturnValue(child)) {
					// only include content types if group has members
					// e.g. blockRootOnly don't have members, so won't be included in contentTypes of doc
					if (child.members && child.members.length > 0 && !hasNodes) {
						contentTypes.push(child.group);
					}

					for (const member of child.members) {
						if (!member) {
							continue;
						}

						// If $or has nodes, we are flattening the group,
						// this is a limitation of validator.
						if (hasNodes && !member.node.isIgnored(ValidatorSpecTransformerName)) {
							contentTypes.push(member.node.getName());
						}

						if (member.node.isIgnored(ValidatorSpecTransformerName)) {
							if (member.node.getType() === 'unsupportedInline') {
								hasUnsupportedInline = true;
							}
							if (member.node.getType() === 'unsupportedBlock') {
								hasUnsupportedBlock = true;
							}
							continue;
						}

						for (const mark of member.node.getMarks(member.node.hasStage0())) {
							if (!mark.isIgnored(ValidatorSpecTransformerName)) {
								marks.add(mark.getType());
							}
						}
					}
				} else if (isNodeReturnValue(child)) {
					if (child.node.isIgnored(ValidatorSpecTransformerName)) {
						if (child.node.getType() === 'unsupportedInline') {
							hasUnsupportedInline = true;
						}
						if (child.node.getType() === 'unsupportedBlock') {
							hasUnsupportedBlock = true;
						}
						continue;
					}

					contentTypes.push(child.node.getName());

					for (const mark of child.node.getMarks(child.node.hasStage0())) {
						if (!mark.isIgnored(ValidatorSpecTransformerName)) {
							marks.add(mark.getType());

							res[mark.getType()] = {
								mark: mark,
								json: buildMarkValidatorSpec(mark),
							};
						}
					}
				}
			}

			return {
				marks: Array.from(marks),
				contentTypes,
				minItems: 0,
				hasUnsupportedInline,
				hasUnsupportedBlock,
			};
		},
	};
};

/**
 * @DSLCompatibilityException
 *
 * Doc node is special and flattens some of the grpups inside of the content expression.
 * It also doesn't include layoutSection in the content expression. But we need it to output the validator spec.
 */
function rewriteDocNodeContent(content: Array<ContentVisitorReturnType>) {
	// Filter out layoutSection as it's not included in the doc content in validator spec
	content[0].contentTypes = content[0].contentTypes.filter(
		(nodeName) => nodeName !== 'layoutSection',
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterItemsFromContent(json: Record<string, any>, itemsToRemove: Array<string>) {
	if (!json) {
		return;
	}

	if (json.props.content?.items && Array.isArray(json.props.content.items[0])) {
		for (let i = 0; i < json.props.content.items.length; i++) {
			json.props.content.items[i] = json.props.content.items[i].filter((item: string) => {
				return !itemsToRemove.includes(item);
			});
		}
	}
}

// @DSLCompatibilityException
// Nested expand content is a pseudo group that has a unique output format.
function handleNestedExpandContent(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json: Record<string, any>,
	content: Array<ContentVisitorReturnType>,
) {
	if (node.getName() !== 'nestedExpand_content') {
		return;
	}

	json.props.content = buildContent(node, content);
	const props = json.props;
	delete json.props;
	Object.assign(json, props.content);
}

// @DSLCompatibilityException
// Apply compatibility exceptions to a node.
function applyCompatibilityExceptions(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	json: ValidatorSpecNode,
	content: Array<ContentVisitorReturnType>,
) {
	// @DSLCompatibilityException
	// tableCell_content is a pseudo group and needs to be ignored in the validator spec.
	if (node.getName() === 'tableRow') {
		filterItemsFromContent(json, ['tableCell_content']);
	}

	// @DSLCompatibilityException
	// nestedExpand_content is a pseudo group and needs to be ignored in the validator spec.
	if (
		node.getName() === 'tableCell' ||
		node.getName() === 'tableHeader' ||
		node.getName() === 'tableCellContent'
	) {
		filterItemsFromContent(json, ['nestedExpand_content']);
	}

	if (node.getName() === 'nestedExpand_content' && content.length) {
		handleNestedExpandContent(node, json, content);
		return json;
	}
}

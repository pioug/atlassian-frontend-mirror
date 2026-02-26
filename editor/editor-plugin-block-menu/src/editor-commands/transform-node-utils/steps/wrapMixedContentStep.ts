import { breakoutResizableNodes } from '@atlaskit/editor-common/utils';
import type { Mark, Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { removeDisallowedMarks } from '../marks';
import type { TransformStep, NodeTypeName } from '../types';
import { NODE_CATEGORY_BY_TYPE } from '../types';
import { convertTextNodeToParagraph, createTextContent, isTextNode } from '../utils';

/**
 * Creates a layout section with two columns, where the first column contains the provided content.
 * Preserves breakout marks if provided.
 */
const createLayoutSection = (
	content: PMNode[],
	layoutSection: NodeType,
	layoutColumn: NodeType,
	marks?: readonly Mark[],
): PMNode | null => {
	const columnOne = layoutColumn.createAndFill({}, removeDisallowedMarks(content, layoutColumn));
	const columnTwo = layoutColumn.createAndFill();

	if (!columnOne || !columnTwo) {
		return null;
	}

	return layoutSection.createAndFill({}, [columnOne, columnTwo], marks);
};

/**
 * Creates a container with text content (for codeblocks).
 */
const createTextContentContainer = (
	textContentArray: string[],
	targetNodeType: NodeType,
	schema: Schema,
): PMNode | null => {
	const textContent = textContentArray.join('\n');
	const textNode = textContent ? schema.text(textContent) : null;
	return targetNodeType.createAndFill({}, textNode);
};

/**
 * Creates a regular container with node content.
 */
const createNodeContentContainer = (
	nodeContent: PMNode[],
	targetNodeType: NodeType,
): PMNode | null => {
	// [FEATURE FLAG: platform_editor_block_menu_expand_localid_fix]
	// Pre-assigns a localId so the localId plugin's appendTransaction does not replace the node
	// object, preserving the expandedState WeakMap entry set in transformNode.ts.
	// To clean up: remove the if-else, always use the flag-on branch.
	const isExpandType = targetNodeType.name === 'expand' || targetNodeType.name === 'nestedExpand';
	const nodeAttrs =
		isExpandType && fg('platform_editor_block_menu_expand_localid_fix')
			? { localId: crypto.randomUUID() }
			: {};
	return targetNodeType.createAndFill(nodeAttrs, nodeContent);
};

/**
 * Handles the edge case where transforming from a container to another container results in
 * all content breaking out (no valid children for the target). In this case, creates an empty
 * container to ensure the target container type is created.
 *
 * We can determine if there were no valid children by checking if no container was created
 * (`!hasCreatedContainer`) and there are nodes in the result (`result.length > 0`), which
 * means all content broke out rather than being wrapped.
 *
 * @param result - The current result nodes after processing
 * @param hasCreatedContainer - Whether a container was already created during processing
 * @param fromNode - The original source node (before unwrapping)
 * @param targetNodeType - The target container type
 * @param targetNodeTypeName - The target container type name
 * @param schema - The schema
 * @returns The result nodes with an empty container prepended if needed, or the original result
 */
const handleEmptyContainerEdgeCase = (
	result: PMNode[],
	hasCreatedContainer: boolean,
	fromNode: PMNode,
	targetNodeType: NodeType,
	targetNodeTypeName: NodeTypeName,
	schema: Schema,
): PMNode[] => {
	const isFromContainer = NODE_CATEGORY_BY_TYPE[fromNode.type.name as NodeTypeName] === 'container';
	const isTargetContainer = NODE_CATEGORY_BY_TYPE[targetNodeTypeName] === 'container';
	// If no container was created but we have nodes in result, all content broke out
	// (meaning there were no valid children that could be wrapped)
	const allContentBrokeOut = !hasCreatedContainer && result.length > 0;

	const shouldCreateEmptyTarget = isFromContainer && isTargetContainer && allContentBrokeOut;

	if (!shouldCreateEmptyTarget) {
		return result;
	}

	if (targetNodeTypeName === schema.nodes.codeBlock.name) {
		const emptyCodeBlock = createTextContentContainer([], schema.nodes.codeBlock, schema);
		return emptyCodeBlock ? [emptyCodeBlock, ...result] : result;
	}

	const emptyParagraph = schema.nodes.paragraph.create();
	// [FEATURE FLAG: platform_editor_block_menu_expand_localid_fix]
	// Same localId pre-assignment rationale as createNodeContentContainer above.
	// To clean up: remove the if-else, always use the flag-on branch.
	const isExpandType = targetNodeTypeName === 'expand' || targetNodeTypeName === 'nestedExpand';
	const emptyContainerAttrs =
		isExpandType && fg('platform_editor_block_menu_expand_localid_fix')
			? { localId: crypto.randomUUID() }
			: {};
	const emptyContainer = targetNodeType.create(emptyContainerAttrs, emptyParagraph);
	return [emptyContainer, ...result];
};

/**
 * A wrap step that handles mixed content according to the Compatibility Matrix:
 * - Wraps consecutive compatible nodes into the target container
 * - Same-type containers break out as separate containers (preserved as-is)
 * - NestedExpands break out as regular expands (converted since nestedExpand can't exist outside expand)
 * - Container structures that can't be nested in target break out (not flattened)
 * - Text/list nodes that can't be wrapped are converted to paragraphs and merged into the container
 * - Atomic nodes (tables, media, macros) break out
 *
 * Special handling for layouts:
 * - Layout sections break out as separate layouts (preserved as-is, not wrapped)
 * - Other nodes (including headings, paragraphs, lists) are wrapped into layout columns within a layout section
 * - Layouts always require layoutColumns as children (never paragraphs directly)
 * - Layout columns can contain most block content including headings, paragraphs, lists, etc.
 *
 * Special handling for codeblocks:
 * - Text nodes are converted to plain text and added to the codeblock
 *
 * Edge case handling:
 * - For regular containers: If all content breaks out (container → container transform with no
 *   valid children), an empty container with a paragraph is created to ensure the target type exists
 * - For layouts: Edge case handling is skipped because layouts require columns, not direct paragraphs.
 *   If all content breaks out, only the broken-out nodes are returned (no empty layout created)
 *
 * What can be wrapped depends on the target container's schema:
 * - expand → panel: tables break out, nestedExpands convert to expands and break out
 * - expand → blockquote: tables/media break out, nestedExpands convert to expands and break out, headings converted to paragraphs
 * - expand → expand: tables/media stay inside (expands can contain them)
 * - multi → layoutSection: layout sections break out, headings/paragraphs/lists wrapped into layout columns
 *
 * Example: expand(p('a'), table(), p('b')) → panel: [panel(p('a')), table(), panel(p('b'))]
 * Example: expand(p('a'), panel(p('x')), p('b')) → panel: [panel(p('a')), panel(p('x')), panel(p('b'))]
 * Example: expand(p('a'), nestedExpand({title: 'inner'})(p('x')), p('b')) → panel: [panel(p('a')), expand({title: 'inner'})(p('x')), panel(p('b'))]
 * Example: expand(nestedExpand()(p())) → panel: [panel(), expand()(p())] (empty panel when all content breaks out)
 * Example: [p('a'), layoutSection(...), p('b')] → layoutSection: [layoutSection(layoutColumn(p('a'))), layoutSection(...), layoutSection(layoutColumn(p('b')))]
 * Example: [h1('heading'), p('para')] → layoutSection: [layoutSection(layoutColumn(h1('heading'), p('para')))] (headings stay as headings in layouts)
 */
export const wrapMixedContentStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, fromNode } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const isLayout = targetNodeTypeName === 'layoutSection';
	const isCodeblock = targetNodeTypeName === 'codeBlock';
	const { layoutSection, layoutColumn } = schema.nodes;

	const sourceSupportsBreakout = breakoutResizableNodes.includes(fromNode.type.name);
	const targetSupportsBreakout = breakoutResizableNodes.includes(targetNodeTypeName);
	const shouldPreserveBreakout = sourceSupportsBreakout && targetSupportsBreakout;

	let breakoutMark: Mark | undefined;
	if (shouldPreserveBreakout) {
		breakoutMark = fromNode.marks.find((mark) => mark.type.name === 'breakout');
	}

	const result: PMNode[] = [];
	let currentContainerContent: Array<PMNode | string> = [];
	let hasCreatedContainer = false;

	const flushCurrentContainer = () => {
		if (currentContainerContent.length === 0) {
			return;
		}

		let container: PMNode | null = null;

		if (isLayout) {
			container = createLayoutSection(
				currentContainerContent as PMNode[],
				layoutSection,
				layoutColumn,
				breakoutMark ? [breakoutMark] : undefined,
			);
		} else if (isCodeblock) {
			container = createTextContentContainer(
				currentContainerContent as string[],
				targetNodeType,
				schema,
			);
		} else {
			container = createNodeContentContainer(currentContainerContent as PMNode[], targetNodeType);
		}

		if (container) {
			result.push(container);
			hasCreatedContainer = true;
		}

		currentContainerContent = [];
	};

	const canNodeBeWrapped = (node: PMNode): boolean => {
		const validationType = isLayout ? layoutColumn : targetNodeType;
		return validationType.validContent(
			Fragment.from(removeDisallowedMarks([node], validationType)),
		);
	};

	const handleWrappableNode = (node: PMNode) => {
		const validationType = isLayout ? layoutColumn : targetNodeType;
		currentContainerContent.push(...removeDisallowedMarks([node], validationType));
	};

	const handleCodeblockTextNode = (node: PMNode) => {
		currentContainerContent.push(createTextContent(node));
	};

	const handleConvertibleTextNode = (node: PMNode) => {
		const paragraph = convertTextNodeToParagraph(node, schema);
		if (paragraph) {
			currentContainerContent.push(paragraph);
		}
	};

	const handleUnsupportedNode = (node: PMNode) => {
		flushCurrentContainer();
		result.push(node);
	};

	const processNode = (node: PMNode) => {
		if (canNodeBeWrapped(node)) {
			handleWrappableNode(node);
			return;
		}

		if (isTextNode(node) && isCodeblock) {
			handleCodeblockTextNode(node);
			return;
		}

		if (isTextNode(node)) {
			handleConvertibleTextNode(node);
			return;
		}

		// All other nodes that cannot be wrapped in the target node - break out
		// Examples: same-type containers, tables in panels, layoutSections in layouts
		handleUnsupportedNode(node);
	};

	nodes.forEach(processNode);
	flushCurrentContainer();

	if (isLayout) {
		return result.length > 0 ? result : nodes;
	}

	const finalResult = handleEmptyContainerEdgeCase(
		result,
		hasCreatedContainer,
		fromNode,
		targetNodeType,
		targetNodeTypeName,
		schema,
	);
	return finalResult.length > 0 ? finalResult : nodes;
};
